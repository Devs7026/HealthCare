import json

# Create the notebook structure
notebook = {
    "cells": [
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "print(\"Medical Chatbot with Gemini API\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "%pwd"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import os\n",
                "os.chdir(\"../\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "%pwd"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "from langchain.document_loaders import PyPDFLoader, DirectoryLoader\n",
                "from langchain.text_splitter import RecursiveCharacterTextSplitter"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "#Extract Data From the PDF File\n",
                "def load_pdf_file(data):\n",
                "    loader= DirectoryLoader (data,\n",
                "                         glob=\"*.pdf\",\n",
                "                         loader_cls=PyPDFLoader)\n",
                "\n",
                "    documents= loader.load()\n",
                "\n",
                "    return documents"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "extracted_data= load_pdf_file(data='Data/')"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "#Split the Data into Text Chunks\n",
                "def text_split(extracted_data):\n",
                "    text_splitter=RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)\n",
                "    text_chunks=text_splitter.split_documents (extracted_data)\n",
                "    return text_chunks"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "text_chunks=text_split(extracted_data)\n",
                "print(\"Length of Text Chunks\", len(text_chunks))"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "from langchain.embeddings import HuggingFaceEmbeddings"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "#Download the Embeddings from Hugging Face\n",
                "def download_hugging_face_embeddings():\n",
                "    embeddings=HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')\n",
                "    return embeddings"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "embeddings= download_hugging_face_embeddings()"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "query_result =  embeddings.embed_query(\"Hello world\")\n",
                "print(\"Length\", len(query_result))"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "from dotenv import load_dotenv\n",
                "import os\n",
                "load_dotenv()"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "PINECONE_API_KEY=os.environ.get('PINECONE_API_KEY')\n",
                "GEMINI_API_KEY=os.environ.get('GEMINI_API_KEY')\n",
                "\n",
                "print(f\"Pinecone API Key: {'✓' if PINECONE_API_KEY else '✗'}\")\n",
                "print(f\"Gemini API Key: {'✓' if GEMINI_API_KEY else '✗'}\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "from pinecone.grpc import PineconeGRPC as Pinecone\n",
                "from pinecone import ServerlessSpec\n",
                "import os\n",
                "\n",
                "pc = Pinecone(api_key=PINECONE_API_KEY)\n",
                "\n",
                "index_name= \"medicalbot\"\n",
                "\n",
                "# Check if index already exists\n",
                "try:\n",
                "    pc.create_index(\n",
                "        name=index_name,\n",
                "        dimension=384,\n",
                "        metric=\"cosine\",\n",
                "        spec=ServerlessSpec(cloud=\"aws\", region=\"us-east-1\")\n",
                "    )\n",
                "    print(f\"Created new index: {index_name}\")\n",
                "except Exception as e:\n",
                "    print(f\"Index {index_name} already exists or error: {e}\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import os\n",
                "os.environ[\"PINECONE_API_KEY\"]= PINECONE_API_KEY"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "from langchain_pinecone import PineconeVectorStore\n",
                "# Embed each chunk and upsert the embeddings into your Pinecone index.\n",
                "docsearch = PineconeVectorStore.from_documents(\n",
                "    documents=text_chunks,\n",
                "    index_name=index_name,\n",
                "    embedding=embeddings\n",
                ")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Connect to existing index\n",
                "from langchain_pinecone import PineconeVectorStore\n",
                "\n",
                "docsearch = PineconeVectorStore.from_existing_index(\n",
                "    index_name=index_name,\n",
                "    embedding=embeddings\n",
                ")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "retriever = docsearch.as_retriever(search_type=\"similarity\", search_kwargs={\"k\":3})"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "retrieved_docs= retriever.invoke(\"What is Psoriasis?\")\n",
                "print(f\"Retrieved {len(retrieved_docs)} documents\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Initialize Gemini LLM\n",
                "from langchain_google_genai import ChatGoogleGenerativeAI\n",
                "import google.generativeai as genai\n",
                "\n",
                "# Configure Gemini API\n",
                "genai.configure(api_key=GEMINI_API_KEY)\n",
                "\n",
                "# Initialize the LLM with Gemini\n",
                "llm = ChatGoogleGenerativeAI(\n",
                "    model=\"gemini-pro\",\n",
                "    temperature=0.4,\n",
                "    max_output_tokens=500,\n",
                "    google_api_key=GEMINI_API_KEY\n",
                ")\n",
                "\n",
                "print(\"Gemini LLM initialized successfully!\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "from langchain.chains import create_retrieval_chain\n",
                "from langchain.chains.combine_documents import create_stuff_documents_chain\n",
                "from langchain_core.prompts import ChatPromptTemplate\n",
                "\n",
                "system_prompt = (\n",
                "    \"You are a medical assistant for question-answering tasks. \"\n",
                "    \"Use the following pieces of retrieved context to answer \"\n",
                "    \"the question. If you don't know the answer, say that you \"\n",
                "    \"don't know. Use three sentences maximum and keep the \"\n",
                "    \"answer concise and medical accurate.\"\n",
                "    \"\\n\\n\"\n",
                "    \"{context}\"\n",
                ")\n",
                "\n",
                "prompt = ChatPromptTemplate.from_messages(\n",
                "    [\n",
                "        (\"system\", system_prompt),\n",
                "        (\"human\", \"{input}\"),\n",
                "    ]\n",
                ")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "question_answer_chain = create_stuff_documents_chain(llm, prompt)\n",
                "rag_chain = create_retrieval_chain(retriever, question_answer_chain)\n",
                "\n",
                "print(\"RAG chain created successfully!\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Test the chatbot\n",
                "response= rag_chain.invoke({\"input\":\"What is Psoriasis?\"})\n",
                "print(\"Question: What is Psoriasis?\")\n",
                "print(f\"Answer: {response['answer']}\")"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Interactive Chatbot Function\n",
                "def medical_chatbot():\n",
                "    print(\"🏥 Medical Chatbot with Gemini API\")\n",
                "    print(\"Ask me anything about medical conditions!\")\n",
                "    print(\"Type 'quit' to exit.\")\n",
                "    print(\"=\" * 60)\n",
                "    \n",
                "    while True:\n",
                "        user_input = input(\"\\n👤 You: \")\n",
                "        \n",
                "        if user_input.lower() in ['quit', 'exit', 'bye']:\n",
                "            print(\"🤖 Chatbot: Goodbye! Take care!\")\n",
                "            break\n",
                "        \n",
                "        if not user_input.strip():\n",
                "            print(\"🤖 Chatbot: Please enter a question.\")\n",
                "            continue\n",
                "        \n",
                "        try:\n",
                "            print(\"🤖 Chatbot: Thinking...\")\n",
                "            response = rag_chain.invoke({\"input\": user_input})\n",
                "            print(f\"🤖 Chatbot: {response['answer']}\")\n",
                "        except Exception as e:\n",
                "            print(f\"🤖 Chatbot: Sorry, I encountered an error: {str(e)}\")\n",
                "        \n",
                "        print(\"-\" * 60)\n",
                "\n",
                "# Run the chatbot\n",
                "medical_chatbot()"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "# Alternative: Simple function to test single questions\n",
                "def ask_medical_question(question):\n",
                "    \"\"\"\n",
                "    Function to ask a single medical question\n",
                "    \"\"\"\n",
                "    try:\n",
                "        response = rag_chain.invoke({\"input\": question})\n",
                "        return response['answer']\n",
                "    except Exception as e:\n",
                "        return f\"Error: {str(e)}\"\n",
                "\n",
                "# Example usage\n",
                "questions = [\n",
                "    \"What is diabetes?\",\n",
                "    \"What are the symptoms of hypertension?\",\n",
                "    \"How is asthma treated?\"\n",
                "]\n",
                "\n",
                "for question in questions:\n",
                "    print(f\"\\nQuestion: {question}\")\n",
                "    answer = ask_medical_question(question)\n",
                "    print(f\"Answer: {answer}\")\n",
                "    print(\"-\" * 50)"
            ]
        }
    ],
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "codemirror_mode": {
                "name": "ipython",
                "version": 3
            },
            "file_extension": ".py",
            "mimetype": "text/x-python",
            "name": "python",
            "nbconvert_exporter": "python",
            "pygments_lexer": "ipython3",
            "version": "3.8.5"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 4
}

# Write the notebook to file
with open('trials_gemini.ipynb', 'w') as f:
    json.dump(notebook, f, indent=2)

print("✅ trials_gemini.ipynb created successfully!")
print("\n📋 To use this notebook:")
print("1. Make sure you have the required packages installed:")
print("   pip install google-generativeai langchain-google-genai")
print("2. Set up your environment variables in .env file:")
print("   GEMINI_API_KEY=your_gemini_api_key_here")
print("   PINECONE_API_KEY=your_pinecone_api_key_here")
print("3. Open trials_gemini.ipynb in Jupyter and run the cells!")
