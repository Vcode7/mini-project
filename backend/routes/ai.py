from fastapi import APIRouter, HTTPException
from models import AIRequest, AIResponse, SummarizeRequest, QuestionRequest, TTSRequest
from services.langchain_utils import langchain_service
from services.eleven_labs import eleven_labs_client
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat", response_model=AIResponse)
async def chat(request: AIRequest):
    """General AI chat endpoint"""
    try:
        # Generate text response
        text_response = await langchain_service.general_chat(
            query=request.query,
            context=request.context
        )
        
        # Generate voice response
        audio_base64 = await eleven_labs_client.text_to_speech(text_response)
        
        return AIResponse(
            text=text_response,
            audio_base64=audio_base64
        )
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/summarize", response_model=AIResponse)
async def summarize(request: SummarizeRequest):
    """Summarize webpage content"""
    try:
        # Generate summary
        summary = await langchain_service.summarize_content(
            content=request.content,
            url=request.url
        )
        
        # Generate voice
        audio_base64 = await eleven_labs_client.text_to_speech(summary)
        
        return AIResponse(
            text=summary,
            audio_base64=audio_base64
        )
    except Exception as e:
        logger.error(f"Summarize error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/question", response_model=AIResponse)
async def answer_question(request: QuestionRequest):
    """Answer question based on context"""
    try:
        # Generate answer
        answer = await langchain_service.answer_question(
            question=request.question,
            context=request.context,
            url=request.url
        )
        
        # Generate voice
        audio_base64 = await eleven_labs_client.text_to_speech(answer)
        
        return AIResponse(
            text=answer,
            audio_base64=audio_base64
        )
    except Exception as e:
        logger.error(f"Question error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tts", response_model=AIResponse)
async def text_to_speech(request: TTSRequest):
    """Convert text to speech"""
    try:
        audio_base64 = await eleven_labs_client.text_to_speech(
            text=request.text,
            voice_id=request.voice_id
        )
        
        return AIResponse(
            text=request.text,
            audio_base64=audio_base64
        )
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
