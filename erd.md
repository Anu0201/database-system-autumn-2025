```mermaid
erDiagram
    EMPLOYEES ||--o{ TASK_ASSIGNMENTS : "хүлээн авна"
    EMPLOYEES ||--o{ TASK_LOGS : "бүртгэнэ"
    CUSTOMERS ||--o{ TASKS : "үүсгэнэ"
    TASKS ||--o{ TASK_ASSIGNMENTS : "агуулна"
    TASKS ||--o{ TASK_LOGS : "агуулна"
    DEPARTMENTS ||--o{ EMPLOYEES : "харьяалагдана"

    DEPARTMENTS {
        int department_id PK
        string department_name
        string description
        datetime created_at
    }

    EMPLOYEES {
        int employee_id PK
        string first_name
        string last_name
        string email UK
        string phone
        string position
        int department_id FK
        string role
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    CUSTOMERS {
        int customer_id PK
        string company_name
        string contact_person
        string email
        string phone
        string address
        string customer_type
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    TASKS {
        int task_id PK
        string title
        text description
        int customer_id FK
        int created_by FK
        string priority
        string status
        datetime start_date
        datetime due_date
        int estimated_hours
        int actual_hours
        datetime created_at
        datetime updated_at
        datetime completed_at
    }

    TASK_ASSIGNMENTS {
        int assignment_id PK
        int task_id FK
        int employee_id FK
        int assigned_by FK
        int assignment_order
        string assignment_status
        datetime assigned_date
        datetime started_date
        datetime completed_date
        text assignment_notes
        datetime created_at
    }

    TASK_LOGS {
        int log_id PK
        int task_id FK
        int employee_id FK
        string action_type
        text old_value
        text new_value
        text comment
        datetime created_at
    }
