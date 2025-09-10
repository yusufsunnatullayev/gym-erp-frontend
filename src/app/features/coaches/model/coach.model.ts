import { MemberModel } from '@app/features/members/model/member.model';

export interface CoachModel {
  id: string;
  fullName: string;
  picture: string;
  phoneNumber: string;
  salary: number;
  createdAt: string;
  updatedAt: string;
  students?: MemberModel[];
}
