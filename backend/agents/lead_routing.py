from ..database.db_manager import save_lead

ROUTING_RULES = {
    "Engineering": "Engineering Department (admission.eng@xamk.fi)",
    "Business": "Business School (admission.biz@xamk.fi)",
    "Nursing": "Health & Wellbeing (admission.health@xamk.fi)",
    "Computer Science": "ICT Department (admission.it@xamk.fi)",
}

class LeadRoutingAgent:
    def __init__(self, db):
        self.db = db

    def process_new_lead(self, lead_data: dict):
        # 1. Determine Department
        major = lead_data.get('desired_major', 'General')
        department = ROUTING_RULES.get(major, "International Admissions Office")
        
        # 2. Add routing info
        lead_data['assigned_department'] = department
        
        # 3. Save to DB
        lead = save_lead(self.db, lead_data)
        
        # 4. Simulate Notification (In a real app, send email/SMS)
        notification_log = f"Lead {lead.full_name} from {lead.nationality} routed to {department}."
        
        return {
            "status": "success",
            "lead_id": lead.id,
            "routing": department,
            "log": notification_log
        }
