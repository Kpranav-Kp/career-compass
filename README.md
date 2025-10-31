# 🧭 CareerCompass

CareerCompass is an AI-powered career guidance platform designed specifically for undergraduate students. It helps you analyze your resume, identify skill gaps, get personalized learning roadmaps, and discover opportunities that match your evolving profile.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![Django](https://img.shields.io/badge/django-4.0+-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/react-18.0+-61DAFB.svg)](https://reactjs.org/)

## 🌟 Features

### 🎯 AI-Powered Resume Analysis

- **Smart Skill Extraction**: Upload your resume and let AI extract your technical and soft skills automatically
- **Natural Language Processing**: Understands context and identifies skills from project descriptions and experience
- **Multi-format Support**: Works with various resume formats (PDF supported)

### 📊 Real-Time Market Intelligence

- **Live Demand Analysis**: Get real-time data on skill demand across industries
- **Salary Insights**: Understand how different skills impact compensation
- **Trend Tracking**: Monitor emerging technologies and declining skills

### 🗺️ Personalized Career Roadmaps

- **Custom Learning Paths**: Receive tailored roadmaps based on your current skills and target role
- **Resource Recommendations**: Curated learning resources for each skill
- **Timeline Estimates**: Realistic timelines based on your commitment level

### 💼 Intelligent Job Matching

- **Skill Gap Analysis**: See exactly what skills you need for your dream role
- **Personalized Recommendations**: Get skill suggestions based on your career goals

## 🚀 Tech Stack

### Backend

- **Django 4.2+** - Web framework
- **Django REST Framework** - API development
- **djangorestframework-simplejwt** - JWT authentication
- **OpenRouter AI** - Multiple AI model integration
- **PyPDF2** - PDF text extraction
- **python-dotenv** - Environment variable management

### Frontend

- **React 18+** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### AI/ML Services

- **OpenRouter API** - Free tier AI models (Mistral, Llama, OpenAI)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** and npm ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/downloads))
- **OpenRouter API Key** (Free at [OpenRouter](https://openrouter.ai/keys))

## 🔑 API Endpoints

### Authentication

- `POST /api/v1/register` - User registration
- `POST /api/v1/login` - User login

### Skills & Resume

- `POST /api/v1/extract-skills` - Extract skills from resume (PDF)
- `POST /api/v1/skill-recommend` - Get recommended skills for role
- `POST /api/v1/skill-roadmap` - Generate learning roadmap
- `POST /api/v1/skill-market-analysis` - Analyze market demand
- `POST /api/v1/skill-projects` - Generate project ideas

## 🎨 Features Walkthrough

### 🎯 Resume Upload & Skill Extraction

- Upload your resume (PDF format) and let AI automatically extract your skills, experience, and get personalized skill recommendations based on your target role.
- ### Request Format

  **Method:** `POST`  
  **Content-Type:** `multipart/form-data`  
  **Authentication:** Not required (Public endpoint)

- **Parameters:**

  | Parameter | Type   | Required | Description                                                   |
  | --------- | ------ | -------- | ------------------------------------------------------------- |
  | `file`    | File   | Yes      | Your resume in PDF format (max 5MB)                           |
  | `role`    | String | Yes      | Target job role (e.g., "Software Engineer", "Data Scientist") |

- ### How It Works

  1. **PDF Text Extraction**: Uses PyPDF2 to extract text from your resume
  2. **AI Skill Parsing**: OpenRouter AI (Mistral-7B model) analyzes the text and identifies technical and soft skills
  3. **Context Understanding**: Recognizes skills mentioned in project descriptions, work experience, and coursework
  4. **Role Matching**: If you provide a target role, AI recommends additional skills needed for that position
  5. **Deduplication**: Filters out recommended skills you already have

- ### Tips for Best Results

  ✅ **Resume Format**: Use standard resume formats with clear sections  
  ✅ **File Size**: Keep resume under 5MB  
  ✅ **Content**: Include project descriptions, work experience, and technical skills section  
  ✅ **Target Role**: Specify your desired role for personalized recommendations

- ### Extraction Issues

  The API may return an `extraction_issue` field with these values:

  | Issue             | Meaning                               | Solution                                             |
  | ----------------- | ------------------------------------- | ---------------------------------------------------- |
  | `null`            | No issues, extraction successful      | -                                                    |
  | `bad_read`        | Failed to extract text from PDF       | Try a different PDF format or regenerate your resume |
  | `input_too_long`  | Resume text exceeds 50,000 characters | Shorten your resume to 2-3 pages                     |
  | `no_skills_found` | AI couldn't identify skills in resume | Add a dedicated "Skills" section to your resume      |

### 🗺️ Get Personalized Career Roadmap

- Generate a customized learning roadmap with milestones, resources, and timelines based on your current skills and career goals.
- ### Request Format

  **Method:** `POST`  
  **Content-Type:** `application/json`  
  **Authentication:** Required (JWT token)

- **Parameters:**

  | Parameter | Type          | Required | Description                                                           |
  | --------- | ------------- | -------- | --------------------------------------------------------------------- |
  | `skills`  | Array[String] | Yes      | List of skills you want to learn or improve (1-10 skills recommended) |

- ### How It Works

  **Skill Analysis**: AI analyzes your skill combination and identifies your career path

  **Phase Generation**: Creates logical learning phases with progressive difficulty

  **Resource Curation**: Recommends high-quality tutorials, courses, and documentation

  **Project Ideas**: Suggests hands-on projects to build your portfolio

  **Timeline Estimation**: Provides realistic timelines based on average learning curves

### 📊 Market Analysis

- Analyze real-time market demand, salary insights, and career trends for specific skills to make data-driven decisions about your learning path.
- **Parameters:**

  | Parameter | Type          | Required | Description                                         |
  | --------- | ------------- | -------- | --------------------------------------------------- |
  | `skills`  | Array[String] | Yes      | List of skills to analyze (1-15 skills recommended) |

- ### How It Works

  **Data Aggregation**: Analyzes real-time job postings from multiple sources

  **Demand Scoring**: Calculates demand score (0-100) based on job posting frequency

  **Trend Detection**: Identifies growth patterns using year-over-year comparisons

  **Skill Correlation**: Finds related skills and valuable skill combinations

- ### Understanding the Metrics

  | Metric           | Description                                        | Range       |
  | ---------------- | -------------------------------------------------- | ----------- |
  | **Demand Score** | Overall market demand for the skill                | 0-100       |
  | **Trend**        | Market direction (Rising ↑, Stable →, Declining ↓) | Qualitative |
  | **Growth Rate**  | Year-over-year job posting growth                  | % change    |
  | **Job Sectors**  | Sectors which use the listed skill                 | Text        |

- ### Use Cases

  ✅ **Career Planning**: Compare skills before choosing what to learn  
  ✅ **Skill Prioritization**: Focus on high-demand, high-growth skills  
  ✅ **Portfolio Building**: Align projects with market trends

## 🔮 Future Improvements

- 🧠 ATS Scoring System: Evaluate resume compatibility with specific job roles.
- 💬 Project Idea Generator: Suggest capstone or side projects based on skill levels.
- 🌐 Job APIs: Integrate job boards (LinkedIn, Indeed, etc.) for live opportunities.
- 📈 User Dashboard: Track learning progress and job readiness over time.

## 👨‍💻 Author

**Pranav K**

- GitHub: [@Kpranav-Kp](https://github.com/Kpranav-Kp)

## 🙏 Acknowledgments

- OpenRouter for providing free AI model access
- Django & React communities
- All contributors and supporters

<div align="center">

**Made with ❤️ for students, by a student**

[⭐ Star this repo](https://github.com/Kpranav-Kp/career-compass) if you found it helpful!

</div>
