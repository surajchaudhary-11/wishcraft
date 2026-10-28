import os
import random
from typing import List, Tuple
import httpx
from backend.app.core.config import settings


class AIService:
    @staticmethod
    def _generate_fallback_messages(
        occasion: str,
        recipient_name: str,
        relationship: str,
        tone: str,
        length: str,
        extra_context: str = ""
    ) -> List[str]:
        """
        Generate contextual, varied, heartfelt, or humorous celebration messages
        when external AI API credentials are not supplied.
        """
        name = recipient_name.strip()
        rel = relationship.lower()
        context_str = f" {extra_context.strip()}" if extra_context and extra_context.strip() else ""

        tone_lower = tone.lower()
        if tone_lower == "funny":
            templates = [
                f"Happy Birthday, {name}! 🎉 Remember, age is merely the number of years the world has been privileged to have you around. And also a number we won't mention out loud today!{context_str} Here's to eating way too much cake and pretending to be mature adults tomorrow!",
                f"Cheers to another trip around the sun, {name}! 🎂 Don't count the candles, just enjoy the glow. Thank you for always being the most fun {rel} to get into trouble with! Let's party like our bedtime is still past midnight!",
                f"Happy Birthday to my favorite {rel}, {name}! 🥂 I wanted to get you an extraordinary gift, but then I remembered you already have me in your life. You're welcome! Have the most hilarious, joy-packed celebration today!"
            ]
        elif tone_lower == "romantic":
            templates = [
                f"Happy Birthday, my darling {name}. ❤️ Every single day with you feels like a gift I never knew my heart was waiting for. You bring warmth, magic, and boundless love into my life.{context_str} Today is all about celebrating the wonder that is you.",
                f"To the love of my life, {name} 🌹. With each passing year, my love and adoration for you only grows deeper. Thank you for your kindness, your laughter, and the soft haven of your heart. Happy Birthday, my whole world.",
                f"Happy Birthday, {name}! ✨ You make the ordinary moments feel like poetry. Here's to celebrating your radiant light today, and building a thousand more golden memories side by side."
            ]
        elif tone_lower == "cute":
            templates = [
                f"Happy, happiest birthday, {name}! 🎈 Sending you a galaxy of hugs, sprinkles, and sweet smiles today! Blow out the candles and make the biggest wish ever — you deserve every ounce of sweetness!",
                f"Yay, it's {name}'s birthday! 🧁 May your day be as cheerful as puppies in sunshine, as sweet as fresh cupcakes, and filled with endless giggles! Thank you for being such an adorable {rel}!",
                f"To the brightest sunshine, {name}! 🌸 Hope your birthday is filled with warm hugs, your favorite tunes, and a sky full of shooting stars all meant for you!"
            ]
        elif tone_lower == "emotional":
            templates = [
                f"Dearest {name}, on your birthday, I find myself overwhelmed with gratitude for your existence.{context_str} Through life's changing tides, your steadfast heart and quiet wisdom have been a guiding anchor for me. May this year shower you with the peace, healing, and grand blessings you so deeply deserve.",
                f"Happy Birthday, {name}. Looking back at all we have shared, words fall short of capturing how deeply grateful I am to have you as my {rel}. Your resilience, generosity, and loving spirit inspire me every single day.",
                f"To {name}, on this milestone day. The world became a kinder, softer, and more meaningful place the day you arrived. Never forget how much you are cherished, today and always. Happy Birthday."
            ]
        else: # Heartfelt / default
            templates = [
                f"Happy Birthday, {name}! 🌟 May this new chapter bring you vibrant health, deep happiness, and breakthroughs in everything your heart touches. Thank you for bringing so much light and joy into our lives as an incredible {rel}.{context_str}",
                f"Wishing you the most magical and fulfilling birthday, {name}! 🎂 May your year ahead be blessed with exciting adventures, peaceful moments, and cherished memories with everyone you love.",
                f"Happy Birthday, {name}! You are genuinely one of a kind. Here's to celebrating everything you've accomplished, everything you are, and the wonderful days still ahead. Have a glorious celebration!"
            ]

        # Adjust length if short requested
        if length == "short":
            templates = [t.split(". ")[0] + "! Wishing you a spectacular birthday!" for t in templates]

        return templates

    async def generate_message(
        self,
        occasion: str,
        recipient_name: str,
        relationship: str,
        tone: str,
        length: str = "medium",
        extra_context: str = ""
    ) -> Tuple[List[str], str]:
        """
        Generate celebration messages. Uses OpenAI or Gemini if configured,
        otherwise gracefully falls back to the intelligent internal generator.
        Returns (suggestions, provider_name).
        """
        # Try OpenAI if configured
        if settings.OPENAI_API_KEY and settings.AI_PROVIDER == "openai":
            try:
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
                prompt = (
                    f"Write 3 distinct, beautiful {tone} celebration messages for {recipient_name}'s {occasion}. "
                    f"Relationship: {relationship}. Length: {length}. "
                    f"Additional context: {extra_context}. "
                    f"Return each message separated by '---'."
                )
                response = await client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.8,
                    max_tokens=500
                )
                text = response.choices[0].message.content or ""
                items = [m.strip() for m in text.split("---") if m.strip()]
                if items:
                    return items[:3], "openai"
            except Exception:
                pass

        # Try Gemini if configured
        if settings.GEMINI_API_KEY and settings.AI_PROVIDER == "gemini":
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={settings.GEMINI_API_KEY}"
                prompt = (
                    f"Generate 3 distinct {tone} celebration messages for {recipient_name}'s {occasion}. "
                    f"Relationship: {relationship}. Length: {length}. Context: {extra_context}. "
                    f"Separate the 3 options with '|||'."
                )
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(url, json={
                        "contents": [{"parts": [{"text": prompt}]}]
                    })
                    if resp.status_code == 200:
                        data = resp.json()
                        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                        items = [p.strip() for p in raw_text.split("|||") if p.strip()]
                        if items:
                            return items[:3], "gemini"
            except Exception:
                pass

        # Intelligent Fallback
        suggestions = self._generate_fallback_messages(
            occasion=occasion,
            recipient_name=recipient_name,
            relationship=relationship,
            tone=tone,
            length=length,
            extra_context=extra_context
        )
        return suggestions, "wishcraft-ai-engine"


ai_service = AIService()
