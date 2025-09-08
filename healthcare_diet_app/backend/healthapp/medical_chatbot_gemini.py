#!/usr/bin/env python3
"""
Medical Chatbot using Gemini API
A RAG-based medical question answering system
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

def load_environment():
    """Load environment variables"""
    load_dotenv()
    
    pinecone_key = os.environ.get('PINECONE_API_KEY')
    gemini_key = os.environ.get('GEMINI_API_KEY')
    
    if not pinecone_key:
        raise ValueError("PINECONE_API_KEY not found in environment variables")
    if not gemini_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    print("✅ Environment variables loaded successfully")
    return pinecone_key, gemini_key

def load_pdf_data(data_path='Data/'):
    """Load PDF documents from the data directory"""
    print("📚 Loading PDF documents...")
    loader = DirectoryLoader(
        data_path,
        glob="*.pdf",
        loader_cls=PyPDFLoader
    )
    documents = loader.load()
    print(f"✅ Loaded {len(documents)} documents")
    return documents

def split_text(documents):
    """Split documents into text chunks"""
    print("✂️ Splitting documents into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, 
        chunk_overlap=20
    )
    text_chunks = text_splitter.split_documents(documents)
    print(f"✅ Created {len(text_chunks)} text chunks")
    return text_chunks

def setup_embeddings():
    """Setup HuggingFace embeddings"""
    print("🔤 Setting up embeddings...")
    embeddings = HuggingFaceEmbeddings(
        model_name='sentence-transformers/all-MiniLM-L6-v2'
    )
    print("✅ Embeddings setup complete")
    return embeddings

def setup_pinecone(pinecone_key, index_name="medicalbot"):
    """Setup Pinecone vector database"""
    print("🌲 Setting up Pinecone...")
    pc = Pinecone(api_key=pinecone_key)
    
   
    try:
        pc.create_index(
            name=index_name,
            dimension=384,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        print(f"✅ Created new Pinecone index: {index_name}")
    except Exception as e:
        print(f"ℹ️ Index {index_name} already exists or error: {e}")
    
    return index_name

def setup_vectorstore(text_chunks, embeddings, index_name):
    """Setup vector store with documents"""
    print("🗄️ Setting up vector store...")
    
  
    try:
        docsearch = PineconeVectorStore.from_existing_index(
            index_name=index_name,
            embedding=embeddings
        )
        print("✅ Connected to existing vector store")
    except:
    
        docsearch = PineconeVectorStore.from_documents(
            documents=text_chunks,
            index_name=index_name,
            embedding=embeddings
        )
        print("✅ Created new vector store with documents")
    
    return docsearch

def setup_gemini_llm(gemini_key):
    """Setup Gemini LLM"""
    print("🤖 Setting up Gemini LLM...")
    
    # Configure Gemini API
    genai.configure(api_key=gemini_key)
    
    # Initialize the LLM
    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.4,
        max_output_tokens=500,
        google_api_key=gemini_key
    )
    
    print("✅ Gemini LLM setup complete")
    return llm

def create_rag_chain(retriever, llm):
    """Create RAG chain"""
    print("🔗 Creating RAG chain...")
    
    system_prompt = (
        "You are a medical assistant for question-answering tasks. "
        "Use the following pieces of retrieved context to answer "
        "the question. If you don't know the answer, say that you "
        "don't know. Use three sentences maximum and keep the "
        "answer concise and medically accurate."
        "\n\n"
        "{context}"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])
    
    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    rag_chain = create_retrieval_chain(retriever, question_answer_chain)
    
    print("✅ RAG chain created successfully")
    return rag_chain

def ask_question(rag_chain, question):
    """Ask a single question"""
    try:
        response = rag_chain.invoke({"input": question})
        return response['answer']
    except Exception as e:
        return f"Error: {str(e)}"

def interactive_chatbot(rag_chain):
    """Run interactive chatbot"""
    print("\n🏥 Medical Chatbot with Gemini API")
    print("Ask me anything about medical conditions!")
    print("Type 'quit' to exit.")
    print("=" * 60)
    
    while True:
        user_input = input("\n👤 You: ").strip()
        
        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("🤖 Chatbot: Goodbye! Take care!")
            break
        
        if not user_input:
            print("🤖 Chatbot: Please enter a question.")
            continue
        
        try:
            print("🤖 Chatbot: Thinking...")
            response = rag_chain.invoke({"input": user_input})
            print(f"🤖 Chatbot: {response['answer']}")
        except Exception as e:
            print(f"🤖 Chatbot: Sorry, I encountered an error: {str(e)}")
        
        print("-" * 60)

def main():
    """Main function to run the medical chatbot"""
    try:
        print("🚀 Initializing Medical Chatbot...")
        
        # Load environment
        pinecone_key, gemini_key = load_environment()
        
        # Load and process documents
        documents = load_pdf_data()
        text_chunks = split_text(documents)
        
        # Setup components
        embeddings = setup_embeddings()
        index_name = setup_pinecone(pinecone_key)
        docsearch = setup_vectorstore(text_chunks, embeddings, index_name)
        
        # Setup retriever
        retriever = docsearch.as_retriever(
            search_type="similarity", 
            search_kwargs={"k": 3}
        )
        
        # Setup LLM and RAG chain
        llm = setup_gemini_llm(gemini_key)
        rag_chain = create_rag_chain(retriever, llm)
        
        print("\n🎉 Medical Chatbot is ready!")
        
        # Test the system
        print("\n🧪 Testing the system...")
        test_question = "What is Psoriasis?"
        test_answer = ask_question(rag_chain, test_question)
        print(f"Question: {test_question}")
        print(f"Answer: {test_answer}")
        
        # Start interactive mode
        interactive_chatbot(rag_chain)
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("\n📋 Troubleshooting:")
        print("1. Make sure you have the required packages installed:")
        print("   pip install google-generativeai langchain-google-genai")
        print("2. Check your .env file has the correct API keys:")
        print("   GEMINI_API_KEY=your_gemini_api_key_here")
        print("   PINECONE_API_KEY=your_pinecone_api_key_here")
        print("3. Make sure you have PDF files in the Data/ directory")

if __name__ == "__main__":
    main()
