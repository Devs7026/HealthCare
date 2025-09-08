# Medical Chatbot with Gemini API

This is a RAG (Retrieval-Augmented Generation) based medical chatbot that uses Google's Gemini API for natural language processing and Pinecone for vector storage.

## 🚀 Features

- **Medical Question Answering**: Ask questions about medical conditions, symptoms, and treatments
- **RAG Architecture**: Uses document retrieval to provide accurate, context-aware answers
- **Gemini Integration**: Powered by Google's Gemini Pro model
- **Vector Storage**: Uses Pinecone for efficient document retrieval
- **Interactive Interface**: Both Jupyter notebook and command-line interfaces available

## 📋 Prerequisites

1. **Python 3.8+** installed
2. **API Keys**:
   - Google Gemini API key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))
   - Pinecone API key (get from [Pinecone Console](https://app.pinecone.io/))

## 🛠️ Installation

1. **Install required packages**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   Create a `.env` file in the project root with:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PINECONE_API_KEY=your_pinecone_api_key_here
   ```

3. **Prepare your data**:
   - Place your medical PDF documents in the `Data/` directory
   - The system will automatically process and index these documents

## 🎯 Usage

### Option 1: Jupyter Notebook
1. Open `trials_gemini.ipynb` in Jupyter
2. Run all cells sequentially
3. The interactive chatbot will start automatically

### Option 2: Command Line
```bash
python medical_chatbot_gemini.py
```

### Option 3: Programmatic Usage
```python
from medical_chatbot_gemini import setup_gemini_llm, create_rag_chain

# Setup the system
llm = setup_gemini_llm(gemini_key)
rag_chain = create_rag_chain(retriever, llm)

# Ask questions
response = rag_chain.invoke({"input": "What is diabetes?"})
print(response['answer'])
```

## 🔧 Configuration

### Model Settings
- **Model**: `gemini-pro`
- **Temperature**: 0.4 (balanced creativity and accuracy)
- **Max Tokens**: 500 (concise responses)
- **Chunk Size**: 500 characters
- **Retrieval**: Top 3 most relevant documents

### Customization
You can modify these settings in the code:
- Change the system prompt for different medical specialties
- Adjust temperature for more/less creative responses
- Modify chunk size for different document types
- Change the number of retrieved documents

## 📁 File Structure

```
research/
├── trials_gemini.ipynb          # Jupyter notebook version
├── medical_chatbot_gemini.py    # Standalone Python script
├── create_gemini_notebook.py    # Script to generate notebook
├── README_GEMINI.md            # This file
└── trials.ipynb                # Original OpenAI version
```

## 🧪 Testing

The system includes built-in testing:
1. **Environment Check**: Verifies API keys are loaded
2. **Document Processing**: Confirms PDF loading and chunking
3. **Vector Store**: Tests Pinecone connection and indexing
4. **LLM Setup**: Validates Gemini API connection
5. **RAG Chain**: Tests the complete pipeline with a sample question

## 🚨 Troubleshooting

### Common Issues

1. **API Key Errors**:
   - Verify your API keys are correct
   - Check that the `.env` file is in the right location
   - Ensure no extra spaces in the API keys

2. **Package Installation Issues**:
   ```bash
   pip install --upgrade google-generativeai langchain-google-genai
   ```

3. **Pinecone Index Errors**:
   - The system will automatically create the index if it doesn't exist
   - Check your Pinecone console for index status

4. **Document Loading Issues**:
   - Ensure PDF files are in the `Data/` directory
   - Check that PDFs are not corrupted or password-protected

### Error Messages

- `"PINECONE_API_KEY not found"`: Add your Pinecone API key to `.env`
- `"GEMINI_API_KEY not found"`: Add your Gemini API key to `.env`
- `"No PDF files found"`: Add PDF documents to the `Data/` directory

## 🔒 Security Notes

- Never commit your API keys to version control
- Use environment variables for sensitive information
- Consider rate limiting for production use
- Monitor API usage to avoid unexpected costs

## 📈 Performance Tips

1. **Document Quality**: Use high-quality, well-structured medical documents
2. **Chunk Size**: Adjust based on your document characteristics
3. **Retrieval Count**: Increase `k` for more comprehensive answers
4. **Caching**: The system caches embeddings for better performance

## 🤝 Contributing

To improve the medical chatbot:
1. Add more medical documents to the `Data/` directory
2. Refine the system prompt for better medical accuracy
3. Implement additional medical specialties
4. Add support for different document formats

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your API keys and environment setup
3. Test with the provided sample questions
4. Check the console output for detailed error messages

## 🎉 Success!

Once everything is set up, you'll have a fully functional medical chatbot that can:
- Answer medical questions accurately
- Provide context-aware responses
- Handle complex medical terminology
- Offer interactive conversation

Happy coding! 🏥🤖
