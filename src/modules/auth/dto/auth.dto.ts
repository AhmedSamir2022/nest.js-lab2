import { ApiProperty } from '@nestjs/swagger';

class BaseAuthDto {
     @ApiProperty({
        example:'Samir',
     })
    username: string;

     @ApiProperty({
        example: '12345',
     })
    password: string;

}   

export class SignInDto extends BaseAuthDto {

}

export class SignUpDto extends BaseAuthDto{
     @ApiProperty({
        example: 25,
     })
    age: number;
}   