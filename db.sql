-- CREATE DATABASE PwpGirls;
-- \c PwpGirls
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Users (
  UserID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  Email VARCHAR(255) NOT NULL,
  UNIQUE (Email),
  Password VARCHAR(255) NOT NULL,
  FirstName VARCHAR(255) NOT NULL,
  LastName VARCHAR(255) NOT NULL,
  Title VARCHAR(50),
  DateOfBirth DATE,
  Nationality VARCHAR(50),
  Address VARCHAR(255),
  PhotoLink VARCHAR(255),
  CreatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users
ON Users(Email);

CREATE TABLE Conferences(
  ConferenceID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  CreatorID uuid NOT NULL,
  Name VARCHAR(255) NOT NULL,
  URL VARCHAR(255),
  Subtitles VARCHAR(255),
  ContactInformation VARCHAR(255),
  DeadlinePaperSubmission DATE,
  DeadlinePaperreview DATE,
  DeadlineAcceptanceNotification DATE,
  DeadlineAcceptedPaperUpload DATE,
  PhotoLink VARCHAR(255),
  CONSTRAINT FK_Conferences_Creator FOREIGN KEY (CreatorID) REFERENCES Users(UserID)
);

CREATE TABLE Participations(
  ParticipationID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  UserID uuid NOT NULL,
  ConferenceID uuid NOT NULL,
  CONSTRAINT FK_Participation_User FOREIGN KEY (UserID) REFERENCES Users(UserID),
  CONSTRAINT FK_Participation_Conference FOREIGN KEY (ConferenceID) REFERENCES Conferences(ConferenceID),
  ParticipationType VARCHAR(50) NOT NULL 
);

CREATE TABLE Topics(
  TopicID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  Name VARCHAR(255) NOT NULL
);

CREATE TABLE ConferenceTopics(
  ConferenceTopicID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  Text VARCHAR(255) NOT NULL,
  ConferenceID uuid NOT NULL,
  CONSTRAINT FK_TopicToConference_Conference FOREIGN KEY (ConferenceID) REFERENCES Conferences(ConferenceID)
);

CREATE TABLE ConferenceSessions(
  ConferenceSessionID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  Name VARCHAR(255) NOT NULL,
  Description VARCHAR(255),
  ConferenceID uuid NOT NULL,
  CONSTRAINT FK_Session_Conference FOREIGN KEY (ConferenceID) REFERENCES Conferences(ConferenceID)
);

CREATE TABLE ConferenceSessionTopics(
  ConferenceSessionTopicID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  ConferenceSessionID uuid NOT NULL,
  Text VARCHAR(255) NOT NULL,
  CONSTRAINT FK_SessionToTopic_Session FOREIGN KEY (ConferenceSessionID) REFERENCES ConferenceSessions(ConferenceSessionID)
);

CREATE TABLE Papers(
  PaperID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  CurrentVersion uuid,
  ConferenceID uuid NOT NULL,
  ConferenceSessionID uuid DEFAULT NULL,
  HasAssignedReviewer BOOLEAN NOT NULL DEFAULT FALSE,
  Reviewed BOOLEAN NOT NULL DEFAULT FALSE,
  SentFinal BOOLEAN NOT NULL DEFAULT FALSE,
  Accepted BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT FK_Paper_Conference FOREIGN KEY (ConferenceID) REFERENCES Conferences(ConferenceID),
  CONSTRAINT FK_Paper_Session FOREIGN KEY (ConferenceSessionID) REFERENCES ConferenceSessions(ConferenceSessionID)
);


CREATE TABLE AuthorsToPaper(
  AuthorsToPaperID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  PaperID uuid NOT NULL,
  AuthorID uuid NOT NULL,
  CONSTRAINT FK_AuthorToPaper_Paper FOREIGN KEY (PaperID) REFERENCES Papers(PaperID),
  CONSTRAINT FK_AuthorToPaper_Author FOREIGN KEY (AuthorID) REFERENCES Participations(ParticipationID)
);

CREATE TABLE PaperVersions(
  PaperVersionID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  PaperID uuid NOT NULL,
  Version INT,
  Title VARCHAR(255) NOT NULL,
  Abstract VARCHAR(255),
  DocumentLink VARCHAR(255),
  SubmittedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT FK_PaperVersion_Paper FOREIGN KEY (PaperID) REFERENCES Papers(PaperID)
);

CREATE TABLE PaperVersionTopics(
  PaperVersionTopicsID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  PaperVersionID uuid NOT NULL,
  Text VARCHAR(255) NOT NULL,
  CONSTRAINT FK_PaperVersionTopic_PaperVersion FOREIGN KEY (PaperVersionID) REFERENCES PaperVersions(PaperVersionID)
);

CREATE TABLE Keywords(
  KeywordID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  PaperVersionID uuid NOT NULL,
  Text VARCHAR(255) NOT NULL,
  CONSTRAINT FK_Keyword_PaperVersion FOREIGN KEY (PaperVersionID) REFERENCES PaperVersions(PaperVersionID)
);

CREATE TABLE UserTopics(
  UserTopicID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  Name VARCHAR(255) NOT NULL,
  UserID uuid NOT NULL,
  CONSTRAINT FK_UserTopic_User FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE ReviewersToPaper(
  ReviewerToPaperID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  PaperID uuid NOT NULL,
  ReviewerID uuid NOT NULL,
  CONSTRAINT FK_ReviewerToPaper_Paper FOREIGN KEY (PaperID) REFERENCES Papers(PaperID),
  CONSTRAINT FK_ReviewerToPaper_Reviewer FOREIGN KEY (ReviewerID) REFERENCES Participations(ParticipationID)
);

CREATE TABLE ConflictOfInterests(
  ConflictOfInterestID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  PaperID uuid NOT NULL,
  ReviewerID uuid NOT NULL,
  Description VARCHAR(255),
  CONSTRAINT FK_ConflictOfInterest_Paper FOREIGN KEY (PaperID) REFERENCES Papers(PaperID),
  CONSTRAINT FK_ConflictOfInterest_Reviewer FOREIGN KEY (ReviewerID) REFERENCES Participations(ParticipationID)
); 

CREATE TABLE Evaluations(
  EvaluationID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  PaperVersionID uuid NOT NULL,
  ReviewerToPaperID uuid NOT NULL,
  Accept BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT FK_Keyword_PaperVersion FOREIGN KEY (PaperVersionID) REFERENCES PaperVersions(PaperVersionID),
  CONSTRAINT FK_Evaluation_ReviewerToPaper FOREIGN KEY (ReviewerToPaperID) REFERENCES ReviewersToPaper(ReviewerToPaperID),
  SubmittedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE Comments(
  CommentID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  EvaluationID uuid NOT NULL,
  Comment VARCHAR(255) NOT NULL,
  Public BOOLEAN NOT NULL DEFAULT FALSE,
  PositionInDocument VARCHAR(255),
  CONSTRAINT FK_Comment_Evaluation FOREIGN KEY (EvaluationID) REFERENCES Evaluations(EvaluationID),
  SubmittedAt TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE Papers
ADD CONSTRAINT FK_Paper_CurrentVersion FOREIGN KEY (CurrentVersion) REFERENCES PaperVersions(PaperVersionID);