from fastapi import HTTPException
from starlette.status import HTTP_403_FORBIDDEN, HTTP_401_UNAUTHORIZED, HTTP_400_BAD_REQUEST


class UnauthorizedError(HTTPException):
    def __init__(self, detail):
        super(UnauthorizedError, self).__init__(status_code=HTTP_401_UNAUTHORIZED, detail=detail)


class BadRequest(HTTPException):
    def __init__(self, detail):
        super(BadRequest, self).__init__(status_code=HTTP_400_BAD_REQUEST, detail=detail)
