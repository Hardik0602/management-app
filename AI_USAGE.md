## AI Tools Used

### **Cursor + OpenCode**
*Role: Architecture focused Tasks*

* Make a scalable file structure, including dedicated folders for things like components, screens, layout, etc
* Implement context API. Given their ability to read the root folder, they were used to ensure consistent data flow across different files, allowing updates in the central context to synchronize across the whole webpage
* Because these agents often refer to outdated documentations, initial setup for things like json server (for context API) and toast notifications was done manually. AI's task was to then integrate these things to the existing logic

### **ChatGPT**
*Role: Logic, Debugging, and Ideation*

* Used for discussion on implementation strategies, given its ability to have conversations which feel human
* For most of the development work, a base code and a functional goal was provided
    * For the notifications page, the AI was told that I have a logic for displaying pending actions in a sorted manner which supported navigating to the task which the notifications refers to, and AI was used to assist in building the function to manage read states of these notifications
    * For the comment section and comment-on-action feature the AI was informed about the db.json and json server, with instructions on how the comment needs to be saved in the db.json file for it to be displayed

### **Claude**
*Role: UI Design*
* Used for converting functional code with required features into a production ready/polished design
* The AI was provided the code which had all the required features, with instructions to keep the logic as given while re-imagining the UI for a production ready professional software, and add new features or tweak the core componenets if necessary