/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty({
        format: 'binary',
        type: 'string',
        required: true
    })
    image: Express.Multer.File;
}
