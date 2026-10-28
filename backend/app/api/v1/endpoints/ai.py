from fastapi import APIRouter, HTTPException, status
from backend.app.schemas.ai import AIMessageRequest, AIMessageResponse
from backend.app.services.ai_service import ai_service

router = APIRouter()


@router.post("/generate-message", response_model=AIMessageResponse)
async def generate_message(req: AIMessageRequest):
    """
    Generate personalized celebration message suggestions.
    Works with AI providers (OpenAI / Gemini) or uses intelligent contextual generator.
    """
    suggestions, provider = await ai_service.generate_message(
        occasion=req.occasion,
        recipient_name=req.recipient_name,
        relationship=req.relationship,
        tone=req.tone,
        length=req.length,
        extra_context=req.extra_context or ""
    )

    return AIMessageResponse(
        suggestions=suggestions,
        provider=provider,
        recipient_name=req.recipient_name,
        tone=req.tone
    )

