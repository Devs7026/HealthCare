#!/usr/bin/env python3
"""
Test script to verify the Gemini medical chatbot setup
"""

import os
import sys
from dotenv import load_dotenv

def test_imports():
    """Test if all required packages can be imported"""
    print("🔍 Testing package imports...")
    
    try:
        import google.generativeai as genai
        print("✅ google.generativeai imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import google.generativeai: {e}")
        return False
    
    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
        print("✅ langchain_google_genai imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import langchain_google_genai: {e}")
        return False
    
    try:
        from langchain.document_loaders import PyPDFLoader, DirectoryLoader
        print("✅ langchain document loaders imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import langchain document loaders: {e}")
        return False
    
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
        print("✅ langchain text splitter imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import langchain text splitter: {e}")
        return False
    
    try:
        from langchain.embeddings import HuggingFaceEmbeddings
        print("✅ langchain embeddings imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import langchain embeddings: {e}")
        return False
    
    try:
        from langchain_pinecone import PineconeVectorStore
        print("✅ langchain_pinecone imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import langchain_pinecone: {e}")
        return False
    
    try:
        from pinecone.grpc import PineconeGRPC as Pinecone
        print("✅ pinecone imported successfully")
    except ImportError as e:
        print(f"❌ Failed to import pinecone: {e}")
        return False
    
    return True

def test_environment():
    """Test if environment variables are set"""
    print("\n🔍 Testing environment variables...")
    
    load_dotenv()
    
    gemini_key = os.environ.get('GEMINI_API_KEY')
    pinecone_key = os.environ.get('PINECONE_API_KEY')
    
    if gemini_key:
        print("✅ GEMINI_API_KEY found")
    else:
        print("❌ GEMINI_API_KEY not found")
        return False
    
    if pinecone_key:
        print("✅ PINECONE_API_KEY found")
    else:
        print("❌ PINECONE_API_KEY not found")
        return False
    
    return True

def test_data_directory():
    """Test if data directory exists and contains PDF files"""
    print("\n🔍 Testing data directory...")
    
    data_path = "../Data/"
    
    if not os.path.exists(data_path):
        print(f"❌ Data directory not found: {data_path}")
        return False
    
    print(f"✅ Data directory found: {data_path}")
    
    # Check for PDF files
    pdf_files = []
    try:
        for file in os.listdir(data_path):
            if file.lower().endswith('.pdf'):
                pdf_files.append(file)
    except Exception as e:
        print(f"❌ Error reading data directory: {e}")
        return False
    
    if pdf_files:
        print(f"✅ Found {len(pdf_files)} PDF file(s): {', '.join(pdf_files)}")
    else:
        print("⚠️ No PDF files found in data directory")
        print("   You'll need to add PDF files to use the chatbot")
    
    return True

def test_gemini_connection():
    """Test Gemini API connection"""
    print("\n🔍 Testing Gemini API connection...")
    
    try:
        import google.generativeai as genai
        from dotenv import load_dotenv
        
        load_dotenv()
        gemini_key = os.environ.get('GEMINI_API_KEY')
        
        if not gemini_key:
            print("❌ GEMINI_API_KEY not found")
            return False
        
        genai.configure(api_key=gemini_key)
        
        # Test with a simple model list
        models = genai.list_models()
        print("✅ Gemini API connection successful")
        return True
        
    except Exception as e:
        print(f"❌ Gemini API connection failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Gemini Medical Chatbot Setup")
    print("=" * 50)
    
    tests = [
        ("Package Imports", test_imports),
        ("Environment Variables", test_environment),
        ("Data Directory", test_data_directory),
        ("Gemini API Connection", test_gemini_connection),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Running: {test_name}")
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} PASSED")
            else:
                print(f"❌ {test_name} FAILED")
        except Exception as e:
            print(f"❌ {test_name} ERROR: {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your setup is ready.")
        print("\n🚀 You can now run:")
        print("   python medical_chatbot_gemini.py")
        print("   or open trials_gemini.ipynb in Jupyter")
    else:
        print("⚠️ Some tests failed. Please check the issues above.")
        print("\n📋 Common solutions:")
        print("1. Install missing packages: pip install -r requirements.txt")
        print("2. Set up your .env file with API keys")
        print("3. Add PDF files to the Data/ directory")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
