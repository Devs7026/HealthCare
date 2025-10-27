#!/usr/bin/env python3
"""
Medical Chatbot API for Healthcare App
A simplified version optimized for web API integration
"""

import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
import google.generativeai as genai


_rag_chain = None
_initialized = False

def initialize_chatbot():
    """Initialize the chatbot system once and cache the components"""
    global _rag_chain, _initialized
    
    if _initialized:
        return _rag_chain
    
    try:
        
        load_dotenv()
        
        gemini_key = os.environ.get('GEMINI_API_KEY')
        pinecone_key = os.environ.get('PINECONE_API_KEY')
        
        if not gemini_key or not pinecone_key:
            raise ValueError("API keys not found in environment variables")
        
        # Configure Gemini
        genai.configure(api_key=gemini_key)
        
        llm = None
        possible_models = [
            "gemini-1.5-flash-8b",  
            "gemini-1.5-flash",      
            "gemini-1.5-pro"       
        ]
        last_error = None
        for model_name in possible_models:
            try:
                llm = ChatGoogleGenerativeAI(
                    model=model_name,
                    temperature=0.4,
                    max_output_tokens=500,
                    google_api_key=gemini_key
                )
                break
            except Exception as e:
                last_error = e
                continue
        if llm is None:
            raise RuntimeError(f"Failed to initialize Gemini LLM with any supported model: {last_error}")
        
        # Setup embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name='sentence-transformers/all-MiniLM-L6-v2'
        )
        
        # Setup Pinecone
        pc = Pinecone(api_key=pinecone_key)
        index_name = "healthcare-medicalbot"
        
        
        try:
            pc.create_index(
                name=index_name,
                dimension=384,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
        except:
            pass  
        
        # Setup vector store
        try:
           
            docsearch = PineconeVectorStore.from_existing_index(
                index_name=index_name,
                embedding=embeddings
            )
        except:
           
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
        
        # Setup retriever
        retriever = docsearch.as_retriever(
            search_type="similarity", 
            search_kwargs={"k": 3}
        )
        
        # Create RAG chain
        system_prompt = (
            "You are a medical assistant for the healthcare app. "
            "Use the following pieces of retrieved context to answer "
            "the question. If you don't know the answer, say that you "
            "don't know. Keep the answer concise and medically accurate. "
            "Always provide helpful, professional medical advice."
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

def ask_medical_question(question):
    """Ask a medical question and get an answer"""
    try:
        if not _initialized:
            initialize_chatbot()
        
        response = _rag_chain.invoke({"input": question})
        return response['answer']
        
    except Exception as e:
        return f"I'm sorry, I encountered an error: {str(e)}. Please try again or contact support."

def get_chatbot_status():
    """Get the status of the chatbot system"""
    try:
        gemini_key = os.environ.get('GEMINI_API_KEY')
        pinecone_key = os.environ.get('PINECONE_API_KEY')
        
        status = {
            'gemini_api_key': '✓' if gemini_key else '✗',
            'pinecone_api_key': '✓' if pinecone_key else '✗',
            'initialized': _initialized
        }
        
        return status
    except Exception as e:
        return {'error': str(e)}
