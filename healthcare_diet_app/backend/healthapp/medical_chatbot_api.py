#!/usr/bin/env python3
"""
Medical Chatbot API for Healthcare App
Optimized for high-speed response with Groq LLM and background pre-warming
"""

import os
import threading
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
try:
    from langchain_huggingface import HuggingFaceEmbeddings
except ImportError:
    from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_groq import ChatGroq
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec

_rag_chain = None
_initialized = False
_is_initializing = False
_init_lock = threading.Lock()
_query_cache = {}

def initialize_chatbot():
    """Initialize the chatbot system once and cache the components (thread-safe)"""
    global _rag_chain, _initialized, _is_initializing
    
    if _initialized and _rag_chain is not None:
        return _rag_chain
        
    with _init_lock:
        if _initialized and _rag_chain is not None:
            return _rag_chain
            
        _is_initializing = True
        try:
            load_dotenv()
            
            groq_key = os.environ.get('GROQ_API_KEY') or os.environ.get('GEMINI_API_KEY')
            pinecone_key = os.environ.get('PINECONE_API_KEY')
            
            if not groq_key or not pinecone_key:
                raise ValueError("API keys (GROQ_API_KEY and PINECONE_API_KEY) not found in environment variables")
            
            # Fast default: use active high-speed model directly (avoids network discovery latency)
            selected_model = "qwen/qwen3.8-27b"
            llm = None
            try:
                llm = ChatGroq(
                    model=selected_model,
                    temperature=0.3,
                    max_tokens=350,
                    api_key=groq_key
                )
            except Exception:
                # Dynamic fallback discovery if preferred model is unavailable
                preferred_models = [
                    "qwen/qwen3.8-27b",
                    "openai/gpt-oss-120b",
                    "openai/gpt-oss-20b",
                    "llama-3.3-70b-versatile",
                    "llama-3.1-8b-instant"
                ]
                try:
                    from groq import Groq
                    client = Groq(api_key=groq_key)
                    available_ids = {m.id for m in client.models.list().data if getattr(m, 'active', True)}
                    for pm in preferred_models:
                        if pm in available_ids:
                            selected_model = pm
                            break
                except Exception:
                    pass
                llm = ChatGroq(
                    model=selected_model,
                    temperature=0.3,
                    max_tokens=350,
                    api_key=groq_key
                )
            
            # Setup embeddings (optimized CPU config)
            embeddings = HuggingFaceEmbeddings(
                model_name='sentence-transformers/all-MiniLM-L6-v2',
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': False}
            )
            
            # Setup Pinecone vector store (use populated medicalbot index with medical reference documents)
            index_name = os.environ.get('PINECONE_INDEX_NAME', 'medicalbot')
            try:
                docsearch = PineconeVectorStore.from_existing_index(
                    index_name=index_name,
                    embedding=embeddings
                )
            except Exception:
                index_name = "healthcare-medicalbot"
                try:
                    docsearch = PineconeVectorStore.from_existing_index(
                        index_name=index_name,
                        embedding=embeddings
                    )
                except Exception:
                    pc = Pinecone(api_key=pinecone_key)
                    try:
                        pc.create_index(
                            name=index_name,
                            dimension=384,
                            metric="cosine",
                            spec=ServerlessSpec(cloud="aws", region="us-east-1")
                        )
                    except Exception:
                        pass
                    
                    sample_docs = [
                        "Diabetes is a chronic disease that affects how your body turns food into energy.",
                        "Hypertension, or high blood pressure, is when your blood pressure is consistently too high.",
                        "Asthma is a condition that affects the airways in the lungs, making it difficult to breathe.",
                        "Heart disease refers to several types of heart conditions that can affect heart function.",
                        "Obesity is a complex disease involving an excessive amount of body fat."
                    ]
                    from langchain.schema import Document
                    documents = [Document(page_content=doc) for doc in sample_docs]
                    docsearch = PineconeVectorStore.from_documents(
                        documents=documents,
                        index_name=index_name,
                        embedding=embeddings
                    )
            
            # Setup retriever (k=3 for rich medical context)
            retriever = docsearch.as_retriever(
                search_type="similarity", 
                search_kwargs={"k": 3}
            )
            
            # Create RAG chain with concise, natural prompt
            system_prompt = (
                "You are an AI medical assistant for the Healthify healthcare app. "
                "Synthesize the retrieved medical context below to provide an accurate, clear, and helpful answer. "
                "Never start your response with 'Based on the context', 'Based on the medical context', or similar phrases. "
                "Start directly with the answer or an informative opening sentence. "
                "Format key points clearly with bullet points and bold headers."
                "\n\n"
                "{context}"
            )
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", system_prompt),
                ("human", "{input}"),
            ])
            
            question_answer_chain = create_stuff_documents_chain(llm, prompt)
            _rag_chain = create_retrieval_chain(retriever, question_answer_chain)
            
            _initialized = True
            return _rag_chain
            
        except Exception as e:
            raise Exception(f"Failed to initialize chatbot: {str(e)}")
        finally:
            _is_initializing = False

def _warmup_runner():
    try:
        print("\n[Healthify] Pre-warming AI Medical Chatbot in background...")
        initialize_chatbot()
        print("[Healthify] AI Medical Chatbot is warm and ready for instant responses!\n")
    except Exception as e:
        print(f"[Healthify] Chatbot warmup note: {e}\n")

def start_background_warmup():
    """Silently pre-warm the chatbot in a background thread so the user never experiences cold start"""
    global _initialized, _is_initializing
    if not _initialized and not _is_initializing:
        thread = threading.Thread(target=_warmup_runner, daemon=True)
        thread.start()

def ask_medical_question(question):
    """Ask a medical question and get an answer with caching for fast repeated responses"""
    global _query_cache
    try:
        normalized_q = question.strip().lower()
        if normalized_q in _query_cache:
            return _query_cache[normalized_q]
            
        if not _initialized or _rag_chain is None:
            initialize_chatbot()
        
        response = _rag_chain.invoke({"input": question})
        answer = response.get('answer', '').strip()
        
        # Clean up any residual robotic prefixes if present
        prefixes_to_strip = [
            "Based on the medical context provided,",
            "Based on the provided medical context,",
            "Based on the medical context provided:",
            "Based on the provided medical context:",
            "Based on the retrieved context,",
            "Based on the context provided,",
            "Based on general medical knowledge (as no specific context was provided in the prompt),",
        ]
        for p in prefixes_to_strip:
            if answer.startswith(p):
                answer = answer[len(p):].lstrip()
        
        # Cache answer (keep max 100 entries)
        if len(_query_cache) > 100:
            _query_cache.pop(next(iter(_query_cache)))
        _query_cache[normalized_q] = answer
        
        return answer
        
    except Exception as e:
        return f"I'm sorry, I encountered an error: {str(e)}. Please try again or contact support."

def get_chatbot_status():
    """Get the status of the chatbot system and trigger background pre-warmup"""
    try:
        load_dotenv()
        groq_key = os.environ.get('GROQ_API_KEY') or os.environ.get('GEMINI_API_KEY')
        pinecone_key = os.environ.get('PINECONE_API_KEY')
        
        has_groq = bool(groq_key and groq_key.strip() and groq_key != "your_groq_api_key_here")
        has_pinecone = bool(pinecone_key and pinecone_key.strip() and pinecone_key != "your_pinecone_api_key_here")
        
        # Pre-warm the model in the background as soon as frontend checks status!
        if has_groq and has_pinecone and not _initialized:
            start_background_warmup()
            
        status = {
            'groq_api_key': '✓' if has_groq else '✗',
            'gemini_api_key': '✓' if has_groq else '✗',  # keep for frontend compatibility
            'pinecone_api_key': '✓' if has_pinecone else '✗',
            'initialized': _initialized or _is_initializing
        }
        
        return status
    except Exception as e:
        return {'error': str(e)}

# Auto pre-warm on module import if keys are present
load_dotenv()
start_background_warmup()
