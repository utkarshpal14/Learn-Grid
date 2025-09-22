from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from roadmap_generator import generate_ai_roadmap, generate_quiz

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

@app.route('/api/roadmap', methods=['GET'])
def get_roadmap():
    # Get 'skill' from URL query (e.g., ?skill=python)
    skill = request.args.get('skill', '').lower().strip()
    include_quizzes = request.args.get('quiz', 'false').lower() == 'true'  # ?quiz=true

    if not skill:
        return jsonify({"error": "Skill parameter is required."}), 400

    # Serve predefined roadmap if exists
    try:
        predefined_path = os.path.join('predefined_roadmaps', f'{skill}.json')
        if os.path.exists(predefined_path):
            with open(predefined_path, 'r') as f:
                roadmap = json.load(f)
                if include_quizzes:
                    for module in roadmap.get("modules", []):
                        for sub in module.get("subtopics", []):
                            topic_name = sub.get("title")
                            sub["quiz"] = generate_quiz(topic_name)
                return jsonify(roadmap)
    except Exception as e:
        print(f"Error reading predefined file: {e}")

    # Generate roadmap using AI
    roadmap = generate_ai_roadmap(skill)
    if "error" in roadmap:
        return jsonify(roadmap), 500

    if include_quizzes:
        for module in roadmap.get("modules", []):
            for sub in module.get("subtopics", []):
                topic_name = sub.get("title")
                sub["quiz"] = generate_quiz(topic_name)

    return jsonify(roadmap)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
