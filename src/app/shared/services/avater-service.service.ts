import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentsAttachmentService } from 'src/app/proxy/services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvaterServiceService {
  public picUrl = `${environment.apis.default.url}/`;
  constructor(private doctorProfilePicService: DocumentsAttachmentService) {}

  getProfilePic(entityType: string, entityId: number, attachmentType: string) {

    
    return new Promise<{profilePic:string,picUrl:string}>((resolve, reject) => {
      const subs = new Subscription();

      subs.add(
        this.doctorProfilePicService
          .getDocumentInfoByEntityTypeAndEntityIdAndAttachmentType(
            entityType,
            entityId,
            attachmentType
          )
          .subscribe({
            next:(at)=>{
              if (at) {               
                let prePaths: string = '';
                const re = /wwwroot/gi;
                prePaths = at.path ? at.path : '';
                const profilePic = prePaths.replace(re, '');
               
                
                resolve({profilePic,picUrl:this.picUrl});
              }
            },
            error:(err)=>{
              reject(err)
            }
          })
      );
    });
  }
}
