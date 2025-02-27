import { ApiProperty } from "@nestjs/swagger";

export class PostModel {
    @ApiProperty()
    id: number;

    @ApiProperty()
    imageIsBlurred: boolean;

    @ApiProperty()
    imagePath: string;

    @ApiProperty()
    createdAt: Date;
}