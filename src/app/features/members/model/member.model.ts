import { CoachModel } from '../../coaches/model/coach.model';
import { PlanModel } from '../../plans/model/plan.model';

export interface MemberModel {
  id: string;
  fullName: string;
  phoneNumber: string;
  startDate: string;
  status: 'PAID' | 'UNPAID';
  coachId: string;
  planId: string;
  plan: PlanModel;
  coach: CoachModel;
}
