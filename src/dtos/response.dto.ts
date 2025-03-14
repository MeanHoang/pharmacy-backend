export class ResponseDto<T> {
    status: string;
    message: string;
    data: T | null;
  
    constructor(status: string, message: string, data: T | null) {
      this.status = status;
      this.message = message;
      this.data = data;
    }
  }
  