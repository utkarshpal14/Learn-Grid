import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API
try:
    api_key = os.getenv("GEMINI_API_KEY")
    print("Loaded API Key:", api_key[:6] + "..." if api_key else "None")

    if not api_key:
        raise ValueError("GEMINI_API_KEY not found. Please set it in the .env file.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.0-flash')
except Exception as e:
    print(f"Error configuring Generative AI: {e}")
    model = None


def generate_ai_roadmap(skill):
    if not model:
        return {"error": "Generative AI model is not configured. Check API key."}

    prompt = f"""
    Generate ONLY valid JSON. Do NOT add any explanation or markdown. 
    Skill: "{skill}"

    JSON format:
    {{
      "skill": "{skill}",
      "modules": [
        {{
          "title": "Module 1: Basics",
          "subtopics": [
            {{
              "title": "Sub-topic 1",
              "resources": {{
                "youtube": "YouTube search query",
                "udemy": "Udemy search query",
                "coursera": "Coursera search query",
                "articles": "Article search query"
              }}
            }}
          ]
        }}
      ]
    }}
    """

    try:
        response = model.generate_content(prompt)
        if not response.text:
            return {"error": "Gemini returned empty response"}

        cleaned = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"AI generation failed: {e}"}


def generate_quiz(topic):
    """
    Generates a single multiple-choice quiz question for a given topic.
    """
    if not model:
        return {"error": "Generative AI model is not configured. Check API key."}

    prompt = f"""
    You are a quiz designer. Create a single, simple multiple-choice question to test a beginner's knowledge on the topic: "{topic}".
    The question should have 4 options, with one being the correct answer.

    Provide the output ONLY in a valid JSON format like this:
    {{
      "question": "The question text?",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "The correct option text"
    }}
    """
    try:
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "")
        return json.loads(cleaned_response)
    except Exception as e:
        print(f"An error occurred during AI quiz generation: {e}")
        return {"error": f"Could not generate quiz for '{topic}'."}
