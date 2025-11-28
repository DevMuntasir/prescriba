import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  // 'root' মানে সার্ভিসটি অ্যাপ্লিকেশনের সব জায়গায় ইনজেক্ট করা যাবে
  providedIn: 'root'
})
export class UploadService {
  // আপনার ব্যাকএন্ড API endpoint
  private uploadUrl = 'http://localhost:3000/index-data'; 

  constructor(private http: HttpClient) { }

  /**
   * ফাইলটিকে FormData আকারে ব্যাকএন্ডে পাঠায়
   * @param file - File object to upload
   * @returns Observable of the HTTP response
   */
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    // নিশ্চিত করুন যে 'document' নামটি আপনার Node.js সার্ভার আশা করছে
    formData.append('document', file, file.name); 

    // HTTP POST রিকোয়েস্ট
    return this.http.post(this.uploadUrl, formData);
  }
}