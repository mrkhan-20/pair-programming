# app/routers/autocomplete.py
from fastapi import APIRouter
from .. import schemas

router = APIRouter(tags=["autocomplete"])

@router.post("/autocomplete", response_model=schemas.AutocompleteResponse)
def autocomplete(payload: schemas.AutocompleteRequest):
    code = payload.code
    suggestion = ""

    # Very dumb rules – just to mock “AI-like” behavior
    if payload.language == "python":
        if code.strip().endswith("def"):
            suggestion = " my_function():\n    pass"
        elif code.strip().endswith("for"):
            suggestion = " i in range(10):\n    print(i)"
        else:
            suggestion = "\n# TODO: implement"

    if not suggestion:
        suggestion = "// no suggestion"

    return schemas.AutocompleteResponse(suggestion=suggestion)
