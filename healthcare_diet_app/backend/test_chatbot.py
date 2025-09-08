#!/usr/bin/env python3
"""
Test script for the integrated medical chatbot
"""

import os
import sys
import django
from dotenv import load_dotenv

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_chatbot_integration():
    """Test the chatbot integration"""
    print("🧪 Testing Medical Chatbot Integration")
    print("=" * 50)
    
    try:
        # Test 1: Check if medical_chatbot_api can be imported
        print("\n📋 Test 1: Importing medical chatbot module...")
        from healthapp.medical_chatbot_api import ask_medical_question, get_chatbot_status
        print("✅ Medical chatbot module imported successfully")
        
        # Test 2: Check API keys
        print("\n📋 Test 2: Checking API keys...")
        load_dotenv()
        
        gemini_key = os.environ.get('GEMINI_API_KEY')
        pinecone_key = os.environ.get('PINECONE_API_KEY')
        
        if gemini_key:
            print("✅ GEMINI_API_KEY found")
        else:
            print("❌ GEMINI_API_KEY not found")
            
        if pinecone_key:
            print("✅ PINECONE_API_KEY found")
        else:
            print("❌ PINECONE_API_KEY not found")
        
        # Test 3: Check chatbot status
        print("\n📋 Test 3: Checking chatbot status...")
        status = get_chatbot_status()
        print(f"Status: {status}")
        
        # Test 4: Test a simple question (if API keys are available)
        if gemini_key and pinecone_key:
            print("\n📋 Test 4: Testing a simple medical question...")
            try:
                answer = ask_medical_question("What is diabetes?")
                print(f"✅ Question answered: {answer[:100]}...")
            except Exception as e:
                print(f"❌ Error testing question: {e}")
        else:
            print("\n⚠️ Skipping question test - API keys not configured")
        
        print("\n" + "=" * 50)
        print("🎉 Integration test completed!")
        
        if gemini_key and pinecone_key:
            print("\n🚀 The chatbot is ready to use!")
            print("1. Start the backend server: python manage.py runserver")
            print("2. Start the frontend: npm run dev")
            print("3. Open the healthcare app and click the chatbot icon")
        else:
            print("\n⚠️ Please configure your API keys in the .env file:")
            print("   GEMINI_API_KEY=your-gemini-api-key-here")
            print("   PINECONE_API_KEY=your-pinecone-api-key-here")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Make sure all dependencies are installed: pip install -r requirements.txt")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_chatbot_integration()
