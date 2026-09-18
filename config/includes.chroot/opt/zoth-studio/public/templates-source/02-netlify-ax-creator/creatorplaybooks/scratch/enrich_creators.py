import json
import os

def clean_bio(bio):
    if not bio:
        return ""
    # Clean up excess newlines or trailing spaces
    return "\n".join(line.strip() for line in bio.split("\n") if line.strip())

def main():
    # Read the extracted json
    with open("./scratch/all_creators.json", "r") as f:
        creators = json.load(f)

    # Specific profile metadata mappings
    metadata_map = {
        "maya": {
            "focus_areas": ["Build In Public", "Product Design", "Growth Loops"],
            "strengths": ["Rapid Prototyping", "Transparent Storytelling", "Idea Validation"]
        },
        "kp": {
            "focus_areas": ["Community Building", "Build In Public", "AI Shippers"],
            "strengths": ["Vibe Coding Demos", "Community Architecture", "High-Volume Outreach"]
        },
        "gerrit": {
            "focus_areas": ["Design Systems", "SEO Optimization", "Indie Micro-SaaS"],
            "strengths": ["Iconography Design", "Minimalist Stacks", "Backlink Strategy"]
        },
        "lynnzeng": {
            "focus_areas": ["AI Visual Art", "Creative Filmmaking", "Cross-Platform Recycling"],
            "strengths": ["Prompt Engineering", "Short-Form Video Production", "Adobe Firefly Demos"]
        },
        "jaibhagat": {
            "focus_areas": ["Developer Relations", "AI-assisted Coding", "Personal Branding"],
            "strengths": ["Live Show Hosting", "Workshop Design", "Claude Code Workflows"]
        },
        "nealfrazier": {
            "focus_areas": ["Game Development", "Creative Tech", "Community Streaming"],
            "strengths": ["Stream Engagement", "Interactive Narrative Design", "Gameplay Architecture"],
            "followers": 83,
            "followersStr": "83"
        },
        "levelsio": {
            "focus_areas": ["Indie Hacking", "AI SaaS Startups", "Digital Nomad Lifestyle"],
            "strengths": ["Viral Marketing Loops", "Minimalist Tech Stacks", "Niche Identification"],
            "followers": 896000,
            "followersStr": "896K"
        },
        "tdinh_me": {
            "focus_areas": ["Build In Public", "AI Productivity Apps", "SaaS Bootstrapping"],
            "strengths": ["UX/UI Design", "Clean API Utilities", "Transparent Metrics Sharing"],
            "followers": 115000,
            "followersStr": "115K"
        },
        "dannypostma": {
            "focus_areas": ["AI Photo Studios", "Conversion Rate Optimization", "Indie Bootstrapping"],
            "strengths": ["Landing Page Architecture", "AI Model Fine-tuning", "B2B SaaS Marketing"],
            "followers": 108000,
            "followersStr": "108K"
        },
        "arvidkahl": {
            "focus_areas": ["Audience Building", "Bootstrapping Philosophy", "Founder Writing"],
            "strengths": ["Educational Curriculums", "Community Outreach", "Podcast Strategy"],
            "followers": 110000,
            "followersStr": "110K"
        },
        "karpathy": {
            "focus_areas": ["Deep Learning", "AI Education", "Zero-to-Hero Coding"],
            "strengths": ["First-Principles Explanations", "Minimalist Code Repos", "Candid Training Logs"],
            "followers": 3126133,
            "followersStr": "3.1M"
        },
        "stabilityai": {
            "focus_areas": ["Generative AI Models", "Open Source Collaboration", "AI Research"],
            "strengths": ["State-of-the-Art Diffusion", "Open Weights Community", "High-Volume Image Models"],
            "followers": 450000,
            "followersStr": "450K"
        },
        "nousresearch": {
            "focus_areas": ["Open-Source LLMs", "AI Agent Tooling", "Model Fine-tuning"],
            "strengths": ["First-Principles Pretraining", "Open Innovation", "High-Quality Datasets"],
            "followers": 150000,
            "followersStr": "150K"
        },
        "teknium": {
            "focus_areas": ["Pretraining LLMs", "Synthetic Data Generation", "Model Alignment"],
            "strengths": ["Model Architecture", "Fine-Tuning Evaluators", "Data Curation"],
            "followers": 80000,
            "followersStr": "80K"
        },
        "demishassabis": {
            "focus_areas": ["Artificial General Intelligence", "Biomedical Deep Learning", "AI Research Leadership"],
            "strengths": ["Scientific Innovations", "DeepMind Coordination", "AlphaFold Breakthroughs"],
            "followers": 190000,
            "followersStr": "190K"
        }
    }

    for c in creators:
        c_id = c["id"]
        # Apply standard clean bio
        c["bio"] = clean_bio(c.get("bio", ""))
        
        # Merge specific follower and bio metadata updates if mapped
        if c_id in metadata_map:
            c.update(metadata_map[c_id])
        else:
            # Dynamically derive for other niche creators
            c["focus_areas"] = [tag.replace("-", " ").title() for tag in c.get("tags", [])[:3]]
            c["strengths"] = [p.split("—")[0].strip() for p in c.get("pillars", [])[:2]]

        # Ensure plays count is accurate and structure is correct
        c["playsCount"] = len(c.get("plays", []))
        c["playbook_last_updated"] = "2026-06-28"

        # Format playbooks structure
        for play in c.get("plays", []):
            if "emoji" not in play:
                play["emoji"] = "⚡"
            if "frequency" not in play:
                play["frequency"] = "Weekly"

    # Write enriched output to scratch folder
    with open("./scratch/enriched_creators.json", "w") as f:
        json.dump(creators, f, indent=2)
    print("Enrichment complete! Saved to ./scratch/enriched_creators.json")

if __name__ == "__main__":
    main()
