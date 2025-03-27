### **Creating reusable toolbar components**

### **Why This Should Be Done**

#### **1\. Code Reusability**

*   **Shared Logic**: Many of the toolbar buttons (like **bold**, **italic**, and **underline**) have **common behavior** across roles. For example, in both the **Writer** and **Designer** roles, the button will either apply text formatting or not depending on the role context.
    
*   **Efficiency**: By creating a **generic button component** (e.g., `TextFormatButton`), we can **reuse** this button logic across both toolbars. This eliminates the need for duplicating button code for each role, making the codebase **more efficient** and easier to maintain.
    
*   **Single Responsibility**: The `TextFormatButton` component will handle the **text formatting logic** (like bold, italic, underline), while **role-specific logic** (e.g., whether a Writer or Designer can interact with it) will be handled via **props**. This aligns with the **single responsibility principle**, which is one of the core principles of clean code.
    

#### **2\. Consistency Across Toolbars**

*   **Uniformity**: Having a **generic button component** ensures that the same button behaves consistently across both the **Writer** and **Designer** toolbars. If there are any updates to the behavior of text formatting (e.g., adding a new type of text formatting button), you only need to update the logic in **one place**, ensuring consistency across the app.
    
*   **Easier to Extend**: When new features or formatting options need to be added (e.g., underline styles, text highlight), you can extend this **generic button component** and reuse it across both toolbars, keeping the codebase **modular and flexible**.
    

#### **3\. Role-Specific Customizations**

*   While many toolbar buttons will have shared functionality (like bold, italic, and underline), the **Writer** and **Designer** roles might have slightly different access to these buttons or additional functionality. For example:
    
    *   **Writer** might have access to only basic formatting tools.
        
    *   **Designer** might have access to additional settings like font family, size, and color.
        
    
    **Customizing based on role** ensures that:
    
    *   **Writers** only see buttons they need (e.g., bold, italic, underline).
        
    *   **Designers** have access to additional formatting options (e.g., font, color, and layout tools).
        
    
    **Role-Specific Logic** is passed as props to the generic `TextFormatButton` component, ensuring that only the relevant behavior is applied.
    

#### **4\. Scalability and Maintainability**

*   **Extensibility**: If the toolbar needs to be extended in the future (e.g., adding support for new text formatting styles, new tool options), **reusable components** make it much easier to add these features without affecting other parts of the app.
    
*   **Maintainability**: If a bug arises or a feature needs to be updated, you can make changes to the **generic button component** (e.g., `TextFormatButton`), and the changes will automatically reflect across all toolbars without needing to modify each individual toolbar.
    

* * *

### **How This Helps the Codebase**

*   **Simplified Logic**: By abstracting out the button logic into a generic component, you simplify the main toolbar components (e.g., **WriterToolbar**, **DesignerToolbar**) and delegate the logic of the buttons to smaller, reusable components.
    
*   **Cleaner Components**: The **WriterToolbar** and **DesignerToolbar** components become easier to read and maintain since they are only responsible for composing the toolbar UI using existing, reusable button components.
    
*   **Easier Collaboration**: Developers can focus on individual components without worrying about duplication. If a button needs to be updated (e.g., changing the behavior or adding a new feature), developers can work on it in a single location, making **collaboration easier** and preventing conflicting changes.
    

* * *

### **How to Implement This**

#### **1\. Create the Generic Button Component (`TextFormatButton`)**

*   **Objective**: Build a **reusable button component** that handles text formatting (e.g., bold, italic, underline).
    
*   **Action**:
    
    *   The `TextFormatButton` will accept **props** like:
        
        *   `label`: The label of the button (e.g., 'Bold', 'Italic').
            
        *   `icon`: The icon representing the button (e.g., a "B" for Bold).
            
        *   `role`: The user role (e.g., 'Writer', 'Designer'), to determine whether this button is accessible to the user.
            
        *   `onClick`: A function to handle the button click (e.g., toggle bold formatting).
            
    
    Example of a simple `TextFormatButton` component:
    
    jsx
    
    Copy
    
    `const TextFormatButton = ({ label, icon, onClick, role, disabled }) => {
      return (
        
          {icon}
        
      );
    };
    
    // Usage:
     toggleBoldFormatting()}
      role={userRole}  // Role-based logic
      disabled={role !== 'Writer'} // Disable if not Writer
    />` 
    

#### **2\. Role-Based Customizations for Button Logic**

*   **Objective**: Pass **role-based props** to the `TextFormatButton` to customize which buttons are visible or disabled.
    
*   **Action**:
    
    *   When rendering the **WriterToolbar** or **DesignerToolbar**, check the user’s role and pass **role-specific props** to the button components.
        
    
    Example:
    
    jsx
    
    Copy
    
    `const WriterToolbar = ({ role }) => {
      return (
        

           handleBoldClick()}
            role={role}
            disabled={role !== 'Writer'}
          />
           handleItalicClick()}
            role={role}
            disabled={role !== 'Writer'}
          />
          {/* Add other buttons that Writer can access */}
        

      );
    };
    
    const DesignerToolbar = ({ role }) => {
      return (
        

           handleBoldClick()}
            role={role}
          />
           handleItalicClick()}
            role={role}
          />
          {/* Add Designer-specific buttons here */}
        

      );
    };` 
    

#### **3\. Toolbar Initialization**

*   **Objective**: Initialize the **Writer** and **Designer toolbars** with the appropriate **role-specific logic**.
    
*   **Action**:
    
    *   The **Writer toolbar** should only display basic text formatting buttons.
        
    *   The **Designer toolbar** should display all formatting options, including additional design tools like font size, line spacing, and layout.
        

* * *

### **Summary of Benefits**

1.  **Efficiency**: Reduces code duplication, especially when similar buttons are shared between roles.
    
2.  **Maintainability**: Easier to update button logic in one place rather than across multiple toolbars.
    
3.  **Consistency**: Ensures uniform behavior across toolbars (e.g., the bold button works the same way for both **Writer** and **Designer**).
    
4.  **Scalability**: Adding new buttons or toolbar features can be done by modifying just the generic component, without needing to change multiple parts of the app.
    

* * *

### **Next Steps**

*   **Create the `TextFormatButton` component** as a reusable button for text formatting.
    
*   **Integrate the button component** into the **WriterToolbar** and **DesignerToolbar**, ensuring role-based customizations.
    
*   **Test** the toolbar logic to ensure that the **Writer** and **Designer** see the correct buttons.