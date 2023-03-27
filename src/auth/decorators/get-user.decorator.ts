import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';


export const GetUser = createParamDecorator( ( data: string[], ctx: ExecutionContext ) => {
    
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    let arr: Object = {};

    if( !data ) {

        if( !user )
            throw new InternalServerErrorException('User not found (Request)');

        return user;
    } 

    data.forEach(element => {
        arr[element] = user[element];
    });

    return arr;

});