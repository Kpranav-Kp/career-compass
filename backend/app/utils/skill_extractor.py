from io import BytesIO
from PyPDF2 import PdfReader

def extract_text_from_pdf_file(file_obj) -> str:
    try:
        file_obj.seek(0)
    except Exception:
        pass

    reader = PdfReader(BytesIO(file_obj.read()))
    text_parts = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)
    return "\n".join(text_parts)
