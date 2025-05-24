export interface Image {
    id: number;
    name: string;
  }
  
export interface ImageResponse{
  message:string;
  images: Image[]
}