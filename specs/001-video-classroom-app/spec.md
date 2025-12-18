# Feature Specification: Overcast Video Classroom Application

**Feature Branch**: `001-video-classroom-app`  
**Created**: 2025-12-18  
**Status**: Draft  
**Input**: User description: "we are looking to build a video based classroom application called Overcast. The application provides a main lobby that displays 6 potential classrooms that the user can drop into. When they click on one of the classrooms they are taken to a live video feed of the classroom. They can, at any point, return to the lobby to attend a different classroom. Alternatively if a user clicks the instructor option from the lobby they enter into Instructor mode. When the user clicks a room from instructor mode they are given additional instructor privileges such as the ability to mute participants and begin breakout rooms."

## Clarifications

### Session 2025-12-18

- Q: Can students in the classroom broadcast their own audio and/or video, or are they view-only participants? → A: Students can broadcast both audio and video
- Q: How are users identified when joining a classroom session? → A: Simple name entry (users type their name when joining, no password)
- Q: What is the maximum number of participants allowed in a single classroom session? → A: 15 participants maximum
- Q: When participants are in different breakout rooms, can they see or hear what's happening in other breakout rooms? → A: Complete isolation (participants only see/hear their own breakout room)
- Q: What video quality/resolution should the system target for participant video feeds? → A: Low quality (240p or lower - minimal bandwidth, prioritizes accessibility)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Joins and Observes Classroom (Priority: P1)

A student accesses the Overcast application and sees a main lobby displaying 6 available classrooms. They can browse the available options and select a classroom to join. Once inside, they view a live video feed of the classroom session and can participate by broadcasting their own audio and video. If they decide the class isn't what they need, they can return to the lobby and join a different classroom.

**Why this priority**: This is the core value proposition of Overcast - enabling students to quickly discover and access multiple live classroom sessions. Without this functionality, the application has no purpose. This represents the minimum viable product that delivers immediate value.

**Independent Test**: Can be fully tested by loading the application, viewing the 6 classroom options in the lobby, clicking on any classroom, observing the video feed, and using the "Return to Main Lobby" button to navigate back. Delivers the value of classroom discovery and flexible attendance.

**Acceptance Scenarios**:

1. **Given** a student opens the Overcast application, **When** they land on the main page, **Then** they see a lobby interface with 6 classroom options and two navigation options (Students/Instructors)
2. **Given** a student selects a classroom to join, **When** prompted for identification, **Then** they enter their name (no password required)
3. **Given** a student has entered their name, **When** they join the classroom, **Then** they are taken to a classroom session page displaying the live video feed with their name visible to other participants
4. **Given** a student is viewing a classroom session, **When** they observe the video feed, **Then** they can see the ongoing class instruction in real-time and their own audio/video is broadcast to other participants
5. **Given** a student joins a classroom, **When** their video/audio stream starts, **Then** all other participants (students and instructors) can see and hear them along with their display name
6. **Given** a student is in a classroom session, **When** they click "Return to Main Lobby", **Then** they are taken back to the lobby showing all 6 classroom options
7. **Given** a student is back in the lobby, **When** they select a different classroom, **Then** they can join that new classroom and view its video feed
8. **Given** a student is viewing the lobby, **When** they see the classroom options, **Then** each option displays the cohort name/number (e.g., "Cohort 1", "Cohort 2")

---

### User Story 2 - Instructor Views Classroom with Basic Controls (Priority: P2)

An instructor accesses the Overcast application from the same lobby as students, but selects "Instructors" mode. When they click on a classroom, they enter as an instructor and see the same video feed but with an additional control panel. This control panel provides instructor-specific capabilities that are not available to regular students.

**Why this priority**: Instructor functionality is essential for classroom management but can be delivered after the basic student viewing experience is working. Instructors need differentiated access to manage their classrooms effectively. This builds on the P1 foundation by adding role-based capabilities.

**Independent Test**: Can be tested independently by selecting "Instructors" from the lobby, joining a classroom, and verifying that a control panel appears below the video feed with instructor-specific options. Delivers the value of role-based access and classroom management.

**Acceptance Scenarios**:

1. **Given** an instructor opens the Overcast application, **When** they click the "Instructors" button in the top navigation, **Then** they enter instructor mode
2. **Given** an instructor is in instructor mode, **When** they view the lobby, **Then** they see the same 6 classroom options as students
3. **Given** an instructor selects a classroom, **When** the classroom page loads, **Then** they see the video feed with an additional "Control Panel" section below it
4. **Given** an instructor is viewing the control panel, **When** they interact with it, **Then** they have access to features not available to students
5. **Given** an instructor is in a classroom session, **When** they click "Return to Main Lobby", **Then** they return to the lobby in instructor mode

---

### User Story 3 - Instructor Mutes Participants (Priority: P3)

While in a classroom session, an instructor can use the control panel to manage audio from participants. They can selectively mute individual participants or mute all participants at once to maintain classroom order and reduce background noise during instruction.

**Why this priority**: Muting capabilities are important for classroom management but not essential for the initial launch. This feature enhances the instructor's ability to control the learning environment but depends on the instructor interface (P2) being in place first.

**Independent Test**: Can be tested by entering a classroom as an instructor, viewing the control panel, and using mute controls to silence specific participants or all participants. Delivers the value of audio management and classroom order maintenance.

**Acceptance Scenarios**:

1. **Given** an instructor is in a classroom with the control panel visible, **When** they view the participant list, **Then** they see all active participants with individual audio controls
2. **Given** an instructor views a participant with audio enabled, **When** they click the mute button for that participant, **Then** that participant's audio is disabled
3. **Given** an instructor wants to quickly quiet the room, **When** they click "Mute All Participants", **Then** all participant audio is disabled simultaneously
4. **Given** an instructor has muted a participant, **When** they click the unmute button, **Then** that participant's audio is re-enabled
5. **Given** an instructor mutes participants, **When** students attempt to speak, **Then** their audio does not broadcast to other session attendees

---

### User Story 4 - Instructor Creates Breakout Rooms (Priority: P3)

An instructor can divide the classroom into smaller breakout rooms for group work or discussions. From the control panel, they can create multiple breakout rooms, assign participants to specific rooms, and monitor or join any breakout room. Participants are automatically moved to their assigned breakout room and can collaborate in a smaller group setting with complete isolation - they only see and hear other participants in their own breakout room.

**Why this priority**: Breakout rooms are a valuable collaborative learning tool but represent advanced functionality. This feature is complex and should be implemented after core viewing and basic control features are stable. It's not required for minimum viable classroom operation.

**Independent Test**: Can be tested by entering as an instructor, creating 2-3 breakout rooms, assigning participants to different rooms, and verifying that participants are moved into separate video sessions. Delivers the value of small-group collaboration and differentiated instruction.

**Acceptance Scenarios**:

1. **Given** an instructor is in a classroom session, **When** they click "Begin Breakout Rooms" in the control panel, **Then** they see options to create and configure breakout rooms
2. **Given** an instructor is configuring breakout rooms, **When** they specify the number of rooms (e.g., 3 rooms), **Then** the system creates that many breakout room containers
3. **Given** breakout rooms are created, **When** the instructor assigns participants to specific rooms, **Then** those participants see their breakout room assignment
4. **Given** participants are assigned to breakout rooms, **When** the instructor activates the breakout session, **Then** participants are automatically moved to their designated room's video feed and can only see/hear participants in their own room
5. **Given** a participant is in a breakout room, **When** they view their video feed, **Then** they only see participants assigned to their specific breakout room (complete isolation from other rooms)
6. **Given** breakout rooms are active, **When** the instructor wants to monitor progress, **Then** they can view a list of active rooms and join any room to observe or participate
7. **Given** breakout sessions are complete, **When** the instructor clicks "End Breakout Rooms", **Then** all participants return to the main classroom session

---

### Edge Cases

- **What happens when a classroom has no active video feed?** Display a placeholder message indicating "Classroom session has not started" or "No active session" instead of a blank video area
- **What happens when a student tries to access instructor-only features?** The instructor control panel and related features should not be visible or accessible to users in student mode
- **What happens if a user loses internet connection while viewing a classroom?** Display a reconnection message and attempt to rejoin the video feed automatically when connection is restored
- **What happens when all 6 classrooms are full or inactive?** Display current status for each classroom (e.g., "In Session", "Ended", "Not Started") to help users understand availability
- **What happens when a classroom reaches its 15-participant limit?** Display "Full" status on the classroom in the lobby and prevent additional users from joining until a participant leaves
- **What happens when an instructor tries to mute someone who has already left the session?** The mute control for that participant should be disabled or removed from the participant list
- **What happens if a participant is in a breakout room when the session ends?** Automatically return them to the main lobby with a message indicating the session has ended
- **What happens when switching between student and instructor mode?** If a user switches modes while in a classroom, return them to the lobby in the new mode to prevent confusion about available features
- **What happens if two users enter the same name?** The system should allow duplicate names for MVP simplicity; instructors can distinguish participants by their position in the participant list or ask users to clarify in the session

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a main lobby interface showing 6 distinct classroom options that users can browse and select
- **FR-002**: System MUST provide navigation controls allowing users to switch between "Students" mode and "Instructors" mode from the lobby
- **FR-002a**: System MUST prompt users to enter their name before joining a classroom session
- **FR-002b**: System MUST display each participant's name alongside their video feed in the classroom session
- **FR-003**: System MUST display each classroom with a clear identifier (e.g., "Cohort 1", "Cohort 2", etc.) so users can distinguish between options
- **FR-003a**: System MUST enforce a maximum capacity of 15 participants per classroom
- **FR-003b**: System MUST display capacity status for each classroom in the lobby (e.g., "5/15 participants", "Full")
- **FR-004**: System MUST allow users to click on any classroom option to enter that classroom's session page (unless the classroom is at maximum capacity)
- **FR-004a**: System MUST prevent users from joining a classroom that has reached its 15-participant limit and display an appropriate message
- **FR-005**: System MUST display a live video feed when a user enters a classroom session
- **FR-005a**: System MUST enable students to broadcast their own audio and video when they join a classroom
- **FR-005b**: System MUST display all participant video/audio streams (students and instructors) in the classroom session
- **FR-005c**: System MUST deliver video streams at low resolution (240p or lower) to minimize bandwidth requirements and ensure accessibility on various internet connections
- **FR-006**: System MUST provide a "Return to Main Lobby" button visible on every classroom session page
- **FR-007**: System MUST return users to the lobby showing all 6 classroom options when they click "Return to Main Lobby"
- **FR-008**: System MUST allow users to join different classrooms sequentially without requiring application restart or logout
- **FR-009**: System MUST display an additional control panel to users who enter a classroom in instructor mode
- **FR-010**: System MUST NOT display instructor control panel or features to users in student mode
- **FR-011**: System MUST maintain user mode (student or instructor) when navigating between lobby and classrooms until explicitly changed
- **FR-012**: System MUST provide instructor controls for muting individual participants within the control panel
- **FR-013**: System MUST provide instructor controls for muting all participants simultaneously
- **FR-014**: System MUST provide instructor controls for creating and managing breakout rooms
- **FR-015**: System MUST allow instructors to specify the number of breakout rooms to create
- **FR-016**: System MUST allow instructors to assign participants to specific breakout rooms
- **FR-017**: System MUST automatically transition assigned participants to their designated breakout room when the instructor activates the breakout session
- **FR-017a**: System MUST isolate breakout rooms so participants only see and hear other participants in their assigned room (no cross-room audio/video)
- **FR-018**: System MUST allow instructors to end breakout sessions and return all participants to the main classroom
- **FR-019**: System MUST display branding indicating "Powered by the Overclock Accelerator" on all pages
- **FR-020**: System MUST maintain consistent header navigation (Overcast logo, Students/Instructors buttons) across all pages

### Key Entities

- **Classroom/Cohort**: Represents one of the 6 available classroom sessions. Has an identifier (name/number), current session state (active, inactive, in-session), participant count (current/maximum), capacity limit (15 participants maximum), and associated video feed
- **User/Participant**: Represents someone using the application. Has a display name (entered at join time), mode (student or instructor), current location (lobby or specific classroom), participation status (active, muted, in-breakout-room), and audio/video stream capabilities (all participants can broadcast audio and video)
- **Video Session**: Represents the live video feed for a classroom. Has a source stream (low resolution 240p or lower), active participants list, connection state, and bandwidth optimization settings
- **Control Panel**: Container for instructor-specific features. Contains references to participant management controls, muting controls, and breakout room controls
- **Breakout Room**: Represents an isolated sub-session within a classroom. Has an identifier, assigned participant list, and associated video feed that is completely separate from the main classroom and other breakout rooms (participants cannot see or hear other breakout rooms)

### Assumptions

- **Video Technology**: The application will use a real-time video streaming solution (assumptions: WebRTC-based, supports multiple concurrent viewers, handles participant audio/video streams). Video quality is set at low resolution (240p or lower) to prioritize bandwidth efficiency and accessibility across varying internet connection speeds. Specific technology choice is an implementation detail.
- **User Identification**: Users are identified by entering their name when joining a classroom. No password or authentication system is required for MVP. Names are used to display participant identity and enable instructor controls (muting specific participants, breakout room assignments)
- **Classroom Capacity**: Each classroom supports a maximum of 15 participants to ensure manageable video grid layouts, reasonable instructor control, and quality user experience
- **Concurrent Session Handling**: Users can only be in one classroom at a time but can switch freely between classrooms
- **Breakout Room Assignment**: Manual assignment by instructor is the primary method (automatic/random assignment could be future enhancement)
- **Video Feed Source**: Each classroom's video feed comes from an active session (assumption: instructor or designated presenter is broadcasting)
- **Persistence**: Session state (mute status, breakout room assignments) persists only for the duration of the active session; no long-term storage of classroom history required for MVP

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students can navigate from lobby to any classroom and view the video feed in under 5 seconds (measures ease of access)
- **SC-002**: Students can switch between different classrooms and return to the lobby without encountering errors or broken navigation (measures navigation reliability)
- **SC-003**: Instructors can access instructor mode and see the control panel within 2 clicks from the lobby (measures instructor workflow efficiency)
- **SC-004**: Instructors can mute a participant and have that change take effect within 2 seconds (measures control responsiveness)
- **SC-005**: Instructors can create breakout rooms and assign participants with 100% of assigned participants successfully entering their designated room (measures breakout room reliability)
- **SC-006**: 90% of users can successfully navigate the lobby and join a classroom on their first attempt without assistance (measures UI intuitiveness)
- **SC-007**: System displays all 6 classrooms in the lobby simultaneously with current capacity information (e.g., "8/15") without performance degradation (measures interface scalability)
- **SC-007a**: System accurately enforces the 15-participant limit with 100% reliability (no classroom exceeds capacity) (measures capacity management)
- **SC-008**: Users experience smooth video playback with minimal buffering (< 5 seconds of buffering per 10-minute viewing session) under normal network conditions at low resolution (240p or lower) (measures video streaming reliability and bandwidth efficiency)
- **SC-009**: Mode switching (student to instructor or vice versa) completes successfully 100% of the time without losing user session state (measures mode transition reliability)
- **SC-010**: Control panel features (mute, breakout rooms) are accessible only to instructors, with 0% unauthorized access from student mode (measures security/role separation)
