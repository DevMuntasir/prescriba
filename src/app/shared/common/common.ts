
import { DoctorTitle } from "../../api/enums";

export class Common {

  public static readonly defaultDateFormat = 'DD-MM-YYYY';
  public static readonly responseDateFormat = 'YYYY-MM-DD';

  public static GetDeleteModalConfigurationObject(name: string): any {
    return {
      title: 'Delete Confirmation',
      body: 'Are you sure you want to delete <b>\"' + name + '\" ?</b><p class="text-danger">This action cannot be undone!!</p>',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    };
  }

  public static ParseDateForUI(inputDate: string): string {
    return (
      new Date(inputDate).getDate() +
      '/' +
      (new Date(inputDate).getMonth() + 1) +
      '/' +
      new Date(inputDate).getFullYear()
    );
  }


  public static displayDoctorTitle = [
    { "id": 1, "status": DoctorTitle.Dr, "name": "Dr." },
    { "id": 2, "status": DoctorTitle.AsstProfDr, "name": "Asst. Prof. Dr." },
    { "id": 3, "status": DoctorTitle.AssocProfDr, "name": "Assoc. Prof. Dr." },
    { "id": 4, "status": DoctorTitle.ProfDr, "name": "Prof. Dr." }
  ]

}


