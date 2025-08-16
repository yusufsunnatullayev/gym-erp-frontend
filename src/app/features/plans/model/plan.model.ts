import { MemberModel } from '@app/features/members/model/member.model';

export interface PlanModel {
  id: string;
  name: string;
  duration: string;
  price: number;
  members: MemberModel[];
}
