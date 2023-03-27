import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const RawHeaders = createParamDecorator( ( data: string, cxt: ExecutionContext ) => {

    const req = cxt.switchToHttp().getRequest();
    return req.rawHeaders;

}) ;