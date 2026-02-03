import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const currentUserFactory = (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data
        ? user?.[data]
        : user;
};

// Decorador para obtener el usuario actual desde la request
export const CurrentUser = createParamDecorator(currentUserFactory);