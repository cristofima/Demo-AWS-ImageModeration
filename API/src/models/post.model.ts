import { ApiProperty } from "@nestjs/swagger";

export class PostModel {
    @ApiProperty()
    id: string;

    @ApiProperty()
    imageIsBlurred: boolean;

    @ApiProperty()
    imagePath: string;

    @ApiProperty()
    createdAt: Date;
}