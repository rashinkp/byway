--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: APPROVALSTATUS; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."APPROVALSTATUS" AS ENUM (
    'PENDING',
    'APPROVED',
    'DECLINED'
);


ALTER TYPE public."APPROVALSTATUS" OWNER TO postgres;

--
-- Name: AccessStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AccessStatus" AS ENUM (
    'ACTIVE',
    'BLOCKED',
    'EXPIRED'
);


ALTER TYPE public."AccessStatus" OWNER TO postgres;

--
-- Name: AuthProvider; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AuthProvider" AS ENUM (
    'EMAIL_PASSWORD',
    'GOOGLE',
    'FACEBOOK'
);


ALTER TYPE public."AuthProvider" OWNER TO postgres;

--
-- Name: CertificateStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CertificateStatus" AS ENUM (
    'PENDING',
    'GENERATED',
    'ISSUED',
    'EXPIRED',
    'REVOKED'
);


ALTER TYPE public."CertificateStatus" OWNER TO postgres;

--
-- Name: ContentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContentStatus" AS ENUM (
    'DRAFT',
    'PROCESSING',
    'PUBLISHED',
    'ERROR'
);


ALTER TYPE public."ContentStatus" OWNER TO postgres;

--
-- Name: ContentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContentType" AS ENUM (
    'VIDEO',
    'DOCUMENT',
    'QUIZ'
);


ALTER TYPE public."ContentType" OWNER TO postgres;

--
-- Name: CourseLevel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CourseLevel" AS ENUM (
    'BEGINNER',
    'MEDIUM',
    'ADVANCED'
);


ALTER TYPE public."CourseLevel" OWNER TO postgres;

--
-- Name: CourseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CourseStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."CourseStatus" OWNER TO postgres;

--
-- Name: EntityType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EntityType" AS ENUM (
    'COURSE',
    'CHAT',
    'USER',
    'ASSIGNMENT',
    'GENERAL',
    'PAYMENT',
    'REVIEW'
);


ALTER TYPE public."EntityType" OWNER TO postgres;

--
-- Name: EventType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EventType" AS ENUM (
    'ENROLLMENT',
    'COURSE_CREATION',
    'CHAT_UPDATE',
    'ASSIGNMENT',
    'SYSTEM',
    'PAYMENT',
    'FEEDBACK',
    'ANNOUNCEMENT',
    'COURSE_APPROVED',
    'COURSE_DECLINED',
    'COURSE_ENABLED',
    'COURSE_DISABLED',
    'COURSE_PURCHASED',
    'REVENUE_EARNED',
    'NEW_MESSAGE',
    'INSTRUCTOR_APPROVED',
    'INSTRUCTOR_DECLINED',
    'USER_DISABLED',
    'USER_ENABLED'
);


ALTER TYPE public."EventType" OWNER TO postgres;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- Name: LessonStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LessonStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED'
);


ALTER TYPE public."LessonStatus" OWNER TO postgres;

--
-- Name: MessageType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MessageType" AS ENUM (
    'TEXT',
    'IMAGE',
    'AUDIO'
);


ALTER TYPE public."MessageType" OWNER TO postgres;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELLED',
    'FAILED',
    'COMPLETED',
    'REFUNDED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- Name: PaymentGateway; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentGateway" AS ENUM (
    'STRIPE',
    'PAYPAL',
    'RAZORPAY',
    'WALLET',
    'INTERNAL'
);


ALTER TYPE public."PaymentGateway" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: RefundStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RefundStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'PROCESSED'
);


ALTER TYPE public."RefundStatus" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'INSTRUCTOR',
    'USER'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: TransactionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
    'CANCELLED'
);


ALTER TYPE public."TransactionStatus" OWNER TO postgres;

--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TransactionType" AS ENUM (
    'PAYMENT',
    'REFUND',
    'PURCHASE',
    'WALLET_TOPUP',
    'WALLET_WITHDRAWAL',
    'REVENUE'
);


ALTER TYPE public."TransactionType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Cart" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "couponId" text,
    discount numeric(65,30) DEFAULT 0.00 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Cart" OWNER TO postgres;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Category" OWNER TO postgres;

--
-- Name: Certificate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Certificate" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "enrollmentId" text NOT NULL,
    "certificateNumber" text NOT NULL,
    status public."CertificateStatus" DEFAULT 'PENDING'::public."CertificateStatus" NOT NULL,
    "issuedAt" timestamp(3) without time zone,
    "expiresAt" timestamp(3) without time zone,
    "pdfUrl" text,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Certificate" OWNER TO postgres;

--
-- Name: Chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Chat" (
    id text NOT NULL,
    "user1Id" text NOT NULL,
    "user2Id" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Chat" OWNER TO postgres;

--
-- Name: Course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Course" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    level public."CourseLevel" DEFAULT 'MEDIUM'::public."CourseLevel" NOT NULL,
    price numeric(65,30) DEFAULT 0.00,
    thumbnail text,
    offer numeric(65,30),
    status public."CourseStatus" DEFAULT 'DRAFT'::public."CourseStatus" NOT NULL,
    "categoryId" text NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    duration integer,
    "approvalStatus" public."APPROVALSTATUS" DEFAULT 'PENDING'::public."APPROVALSTATUS" NOT NULL,
    "adminSharePercentage" numeric(65,30) DEFAULT 20.00 NOT NULL
);


ALTER TABLE public."Course" OWNER TO postgres;

--
-- Name: CourseDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CourseDetails" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    prerequisites text,
    "longDescription" text,
    objectives text,
    "targetAudience" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CourseDetails" OWNER TO postgres;

--
-- Name: CourseReview; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CourseReview" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    "userId" text NOT NULL,
    rating integer NOT NULL,
    title text,
    comment text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."CourseReview" OWNER TO postgres;

--
-- Name: Enrollment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Enrollment" (
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    "enrolledAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "accessStatus" public."AccessStatus" DEFAULT 'ACTIVE'::public."AccessStatus" NOT NULL,
    "orderItemId" text
);


ALTER TABLE public."Enrollment" OWNER TO postgres;

--
-- Name: InstructorDetails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InstructorDetails" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "totalStudents" integer DEFAULT 0 NOT NULL,
    "areaOfExpertise" text NOT NULL,
    "professionalExperience" text NOT NULL,
    about text,
    website text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."APPROVALSTATUS" DEFAULT 'PENDING'::public."APPROVALSTATUS" NOT NULL,
    certifications text NOT NULL,
    cv text NOT NULL,
    education text NOT NULL
);


ALTER TABLE public."InstructorDetails" OWNER TO postgres;

--
-- Name: Lesson; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lesson" (
    id text NOT NULL,
    "courseId" text NOT NULL,
    title text NOT NULL,
    description text,
    "order" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    status public."LessonStatus" DEFAULT 'DRAFT'::public."LessonStatus" NOT NULL
);


ALTER TABLE public."Lesson" OWNER TO postgres;

--
-- Name: LessonContent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonContent" (
    id text NOT NULL,
    "lessonId" text NOT NULL,
    type public."ContentType" NOT NULL,
    status public."ContentStatus" DEFAULT 'DRAFT'::public."ContentStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "thumbnailUrl" text,
    description text,
    "fileUrl" text,
    title text
);


ALTER TABLE public."LessonContent" OWNER TO postgres;

--
-- Name: LessonProgress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."LessonProgress" (
    id text NOT NULL,
    "enrollmentId" text NOT NULL,
    "courseId" text NOT NULL,
    "lessonId" text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    score integer,
    "totalQuestions" integer
);


ALTER TABLE public."LessonProgress" OWNER TO postgres;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    "chatId" text NOT NULL,
    "senderId" text NOT NULL,
    content text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "audioUrl" text,
    "imageUrl" text,
    "isRead" boolean DEFAULT false NOT NULL,
    type public."MessageType" DEFAULT 'TEXT'::public."MessageType" NOT NULL
);


ALTER TABLE public."Message" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "eventType" public."EventType" NOT NULL,
    "entityType" public."EntityType" NOT NULL,
    "entityId" text NOT NULL,
    "entityName" text NOT NULL,
    message text NOT NULL,
    link text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text NOT NULL,
    amount numeric(65,30) NOT NULL,
    "paymentStatus" public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "paymentGateway" public."PaymentGateway",
    "paymentId" text,
    "orderStatus" public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone
);


ALTER TABLE public."Order" OWNER TO postgres;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "courseId" text NOT NULL,
    "coursePrice" numeric(65,30) NOT NULL,
    discount numeric(65,30),
    "couponId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "courseTitle" text NOT NULL,
    "adminSharePercentage" numeric(65,30) DEFAULT 20.00 NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO postgres;

--
-- Name: QuizAnswer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuizAnswer" (
    id text NOT NULL,
    "lessonProgressId" text NOT NULL,
    "quizQuestionId" text NOT NULL,
    "selectedAnswer" text NOT NULL,
    "isCorrect" boolean NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."QuizAnswer" OWNER TO postgres;

--
-- Name: QuizQuestion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuizQuestion" (
    id text NOT NULL,
    "lessonContentId" text NOT NULL,
    question text NOT NULL,
    options text[],
    "correctAnswer" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."QuizQuestion" OWNER TO postgres;

--
-- Name: Refund; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Refund" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "courseId" text NOT NULL,
    amount numeric(65,30) NOT NULL,
    reason text,
    status public."RefundStatus" DEFAULT 'PENDING'::public."RefundStatus" NOT NULL,
    "transactionId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "orderItemId" text NOT NULL
);


ALTER TABLE public."Refund" OWNER TO postgres;

--
-- Name: TransactionHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TransactionHistory" (
    id text NOT NULL,
    "orderId" text,
    "userId" text NOT NULL,
    "courseId" text,
    amount double precision NOT NULL,
    "paymentGateway" public."PaymentGateway" NOT NULL,
    "transactionId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    type public."TransactionType" NOT NULL,
    status public."TransactionStatus" NOT NULL,
    "walletId" text,
    metadata jsonb,
    "paymentDetails" jsonb,
    "paymentMethod" text
);


ALTER TABLE public."TransactionHistory" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text,
    "googleId" text,
    avatar text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "authProvider" public."AuthProvider" DEFAULT 'EMAIL_PASSWORD'::public."AuthProvider" NOT NULL,
    "isVerified" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "facebookId" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: UserProfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    bio text,
    education text,
    skills text,
    "phoneNumber" character varying(20),
    country character varying(100),
    city character varying(100),
    address text,
    "dateOfBirth" timestamp(3) without time zone,
    gender public."Gender",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserProfile" OWNER TO postgres;

--
-- Name: Wallet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Wallet" (
    id text NOT NULL,
    "userId" text NOT NULL,
    balance numeric(65,30) DEFAULT 0.00 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Wallet" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: user_verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_verifications (
    id text NOT NULL,
    user_id text NOT NULL,
    email text NOT NULL,
    otp_code character varying(6) NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    attempt_count integer DEFAULT 0 NOT NULL,
    is_used boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_verifications OWNER TO postgres;

--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Cart" (id, "userId", "courseId", "couponId", discount, "createdAt", "updatedAt", "deletedAt") FROM stdin;
e70270bd-3b5f-4a09-b98a-bf863e2007ac	7858f458-beea-4d68-b101-4f72e865ce85	2a12402f-2a72-44e8-93aa-318aef7e5457	\N	0.000000000000000000000000000000	2025-07-08 13:11:10.317	2025-07-08 13:11:10.317	\N
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Category" (id, name, description, "createdAt", "updatedAt", "createdBy", "deletedAt") FROM stdin;
21338664-fc04-4041-8e27-e67a63b86d8c	Technology & Programming	Learn the latest in software development, web technologies, app creation, AI, and more. Ideal for coders and tech enthusiasts.	2025-06-02 10:26:32.078	2025-06-02 10:26:32.078	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N
f87205f6-f7dc-4a2f-a28a-1260f625429e	Business & Management	Courses covering leadership, entrepreneurship, marketing strategies, and project management to grow your business acumen.	2025-06-02 10:27:30.961	2025-06-02 10:27:30.961	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N
c5823796-dee0-4d43-ab99-11e35227bc5c	Creative Arts & Design	Explore your creativity with courses in graphic design, music, photography, animation, and digital illustration.	2025-06-02 10:27:41.233	2025-06-02 10:27:41.233	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N
d869526d-7b31-42c9-a940-f5ff9b59cef8	Health & Wellness	Promote personal well-being with topics like nutrition, fitness, mental health, yoga, and lifestyle improvement.	2025-06-02 10:27:51.033	2025-06-02 10:27:51.033	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N
1c68e671-01d2-4360-b105-f454dbe61b99	Academic & Test Preparation	Academic support and test prep for school subjects, competitive exams, language proficiency tests, and university entrance.	2025-06-02 10:28:03.452	2025-06-02 10:34:16.91	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N
f643ee05-c2c7-460a-b941-4f1a7c0e9d72	Newe category	this is new descriotin	2025-06-20 09:06:59.597	2025-06-20 09:06:59.597	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N
\.


--
-- Data for Name: Certificate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Certificate" (id, "userId", "courseId", "enrollmentId", "certificateNumber", status, "issuedAt", "expiresAt", "pdfUrl", metadata, "createdAt", "updatedAt") FROM stdin;
df7c0003-bc7a-494e-8bde-b0dbbb5a3997	7858f458-beea-4d68-b101-4f72e865ce85	aed45c50-6425-4d06-958a-4cc56ad3fee9	7858f458-beea-4d68-b101-4f72e865ce85	CERT-MCRIBW4Q-47GQXM	GENERATED	\N	\N	https://by-way-uploads.s3.ap-south-1.amazonaws.com/certificates/CERT-MCRP4VDG-R7MVYK.pdf	{"generatedAt": "2025-07-06T13:16:42.742Z", "completionStats": {"averageScore": 0, "totalLessons": 3, "completionDate": "7/6/2025", "instructorName": "Rashin Kp", "completedLessons": 3}}	2025-07-06 10:06:12.844	2025-07-06 13:16:42.742
0f13a039-5717-4b3b-8607-f01950f6faaf	7858f458-beea-4d68-b101-4f72e865ce85	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	7858f458-beea-4d68-b101-4f72e865ce85	CERT-MCRPM5ZS-F1GC20	GENERATED	\N	\N	https://by-way-uploads.s3.ap-south-1.amazonaws.com/certificates/CERT-MCRPM5ZS-F1GC20.pdf	{"generatedAt": "2025-07-06T13:30:09.917Z", "completionStats": {"averageScore": 50, "totalLessons": 5, "completionDate": "7/6/2025", "instructorName": "Rashin Kp", "completedLessons": 5}}	2025-07-06 13:30:09.497	2025-07-06 13:30:09.917
\.


--
-- Data for Name: Chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Chat" (id, "user1Id", "user2Id", "createdAt", "updatedAt") FROM stdin;
8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	7858f458-beea-4d68-b101-4f72e865ce85	2025-07-05 10:37:59.236	2025-07-09 07:00:43.4
f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-27 09:12:29.539	2025-07-09 07:50:50.627
e8ba8f02-08dc-40d0-baad-52ac75ba577e	e50b51b8-92d1-4c95-886d-dae6766fe13f	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-27 09:47:23.78	2025-06-27 09:47:54.786
\.


--
-- Data for Name: Course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Course" (id, title, description, level, price, thumbnail, offer, status, "categoryId", "createdBy", "createdAt", "updatedAt", "deletedAt", duration, "approvalStatus", "adminSharePercentage") FROM stdin;
893833b7-31d4-486a-8cd7-c83a5edb78fd	another	awsdfasdf	BEGINNER	21.000000000000000000000000000000	https://res.cloudinary.com/dxogdfuse/image/upload/v1749204793/courses/cgwuz1n7ye29n6fvprl7.png	21.000000000000000000000000000000	PUBLISHED	f87205f6-f7dc-4a2f-a28a-1260f625429e	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-06 10:13:14.207	2025-07-01 14:30:07.129	\N	12	APPROVED	20.000000000000000000000000000000
aed45c50-6425-4d06-958a-4cc56ad3fee9	Introduction to Data Science	Learn the core concepts of data science including data analysis, visualization, and basic machine learning with Python.	BEGINNER	59.990000000000000000000000000000	https://res.cloudinary.com/dxogdfuse/image/upload/v1749708132/courses/rvjsyovsjdytjsn5ktur.webp	39.990000000000000000000000000000	PUBLISHED	21338664-fc04-4041-8e27-e67a63b86d8c	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-05 05:16:25.727	2025-06-17 17:44:02.057	\N	20	APPROVED	30.000000000000000000000000000000
ba65303e-9081-4e45-9452-f4a8fa449a8c	asdfasdf	asdfasdf	MEDIUM	21.000000000000000000000000000000	https://res.cloudinary.com/dxogdfuse/image/upload/v1749205004/courses/cqicusmfmjqxcrrr6vp4.png	21.000000000000000000000000000000	DRAFT	1c68e671-01d2-4360-b105-f454dbe61b99	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-06 10:16:45.198	2025-06-06 10:16:45.198	\N	12	PENDING	20.000000000000000000000000000000
e4360c40-4a62-470d-9584-5a211f79ed39	sdfggadsfb	asdfsadf	BEGINNER	21.000000000000000000000000000000	https://res.cloudinary.com/dxogdfuse/image/upload/v1749205396/courses/rlcy8w9mwpmupjnyglqr.png	21.000000000000000000000000000000	DRAFT	1c68e671-01d2-4360-b105-f454dbe61b99	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-06 10:23:16.317	2025-06-06 10:23:16.317	\N	21	PENDING	20.000000000000000000000000000000
2a12402f-2a72-44e8-93aa-318aef7e5457	asdfasdfs	asdfasdf	BEGINNER	21.000000000000000000000000000000	https://res.cloudinary.com/dxogdfuse/image/upload/v1749205053/courses/fdjjfzbdzmle8svez4ih.png	21.000000000000000000000000000000	PUBLISHED	1c68e671-01d2-4360-b105-f454dbe61b99	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-06 10:17:33.92	2025-07-01 14:30:28.726	\N	21	APPROVED	20.000000000000000000000000000000
8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Introduction to Web Development	Learn the foundational skills of web development including HTML, CSS, and JavaScript. Build interactive websites from scratch and understand how the web works.	BEGINNER	40.000000000000000000000000000000	https://res.cloudinary.com/dxogdfuse/image/upload/v1748872763/courses/pysav2hqajevkpezaadm.png	39.990000000000000000000000000000	PUBLISHED	21338664-fc04-4041-8e27-e67a63b86d8c	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-02 13:10:15.874	2025-06-18 05:52:07.565	\N	15	APPROVED	20.000000000000000000000000000000
9a8fd49c-d1be-449c-a024-e1e682fc656c	Mastering UI/UX Design	Learn to design intuitive and beautiful digital products with Figma.	MEDIUM	79.000000000000000000000000000000	https://res.cloudinary.com/dxogdfuse/image/upload/v1749796622/courses/fsnbuzp2jjdo4zxzfbyd.webp	59.000000000000000000000000000000	PUBLISHED	c5823796-dee0-4d43-ab99-11e35227bc5c	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-06 10:25:18.903	2025-06-13 06:47:23.671	\N	18	APPROVED	28.000000000000000000000000000000
babca687-877c-4f7f-bf3b-47c3c7999fea	React JS – From Zero to Hero	Build single-page apps using React, hooks, and routing.	MEDIUM	89.000000000000000000000000000000	https://res.cloudinary.com/dxogdfuse/image/upload/v1749797379/courses/iajrxomqa8ujesdf9fcb.webp	54.000000000000000000000000000000	PUBLISHED	21338664-fc04-4041-8e27-e67a63b86d8c	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-05 06:19:27.781	2025-06-13 06:49:39.819	\N	25	APPROVED	27.000000000000000000000000000000
b4a1add7-3fa9-47cd-96b0-1fe62e9f2808	Kerala PSC	sapdfmskdfsdanlf	BEGINNER	29.000000000000000000000000000000	https://res.cloudinary.com/dxogdfuse/image/upload/v1750364654/courses/gmbc5jq5zdaq60v7kiz3.webp	19.000000000000000000000000000000	DRAFT	1c68e671-01d2-4360-b105-f454dbe61b99	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-19 20:24:14.641	2025-06-19 21:01:19.399	\N	10	DECLINED	19.000000000000000000000000000000
41097c8c-8399-431a-9218-6eb3372864e0	;lkasdfsdf	asdfsdaf	ADVANCED	32.000000000000000000000000000000	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750912934339-react-js-programming-language-with-laptop-code-script-screen_1020200-5413.webp	20.000000000000000000000000000000	DRAFT	f87205f6-f7dc-4a2f-a28a-1260f625429e	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	2025-06-26 04:42:14.83	2025-06-26 04:42:14.83	\N	22	PENDING	22.000000000000000000000000000000
\.


--
-- Data for Name: CourseDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CourseDetails" (id, "courseId", prerequisites, "longDescription", objectives, "targetAudience", "createdAt", "updatedAt") FROM stdin;
f072ab41-4c75-44c3-90bc-59a3639cc724	aed45c50-6425-4d06-958a-4cc56ad3fee9	Some basic Python knowledge is helpful but not required.	This beginner course teaches essential data science skills. You’ll work with real-world datasets, build visualizations using matplotlib, and create simple models with scikit-learn. Ideal for those curious about data-driven decision-making.	Load and clean data, Visualize data using graphs, Apply statistics for insights, Build basic ML models	Students, beginners in tech, or professionals pivoting into data roles.	2025-06-12 08:07:00.949	2025-06-12 08:12:43.172
fc8eecf8-10b8-4193-b696-3dbd742d2637	9a8fd49c-d1be-449c-a024-e1e682fc656c	Familiarity with any design tool (e.g., Canva, Photoshop).	Discover UI/UX principles, build wireframes, and conduct user research. You’ll also practice prototyping and accessibility best practices. A practical portfolio project wraps up the course.	Apply UX research methods, Use Figma for prototyping, Improve designs with usability testing	Aspiring designers, front-end devs, product thinkers.	2025-06-13 06:37:02.979	2025-06-13 06:47:23.671
65cb79ac-003b-4bf6-aa0f-a5dae7b636a5	babca687-877c-4f7f-bf3b-47c3c7999fea	JavaScript	A comprehensive course covering React fundamentals, state management, routing, and full deployment.	Component building, React Router, hooks	Front-end developers	2025-06-13 06:49:39.819	2025-06-13 06:49:39.819
5c6dfb61-f3ed-4ae3-b68f-6361646241a2	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Learn the foundational skills of web development including HTML, CSS, and JavaScript. Build interactive websites from scratch and understand how the web works.	Learn the foundational skills of web development including HTML, CSS, and JavaScript. Build interactive websites from scratch and understand how the web works.	Learn the foundational skills of web development including HTML, CSS, and JavaScript. Build interactive websites from scratch and understand how the web works.	Learn the foundational skills of web development including HTML, CSS, and JavaScript. Build interactive websites from scratch and understand how the web works.	2025-06-18 05:52:07.565	2025-06-18 05:52:07.565
\.


--
-- Data for Name: CourseReview; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CourseReview" (id, "courseId", "userId", rating, title, comment, "createdAt", "updatedAt", "deletedAt") FROM stdin;
371b7e1d-ef66-4250-95c9-56a4ef8e696f	9a8fd49c-d1be-449c-a024-e1e682fc656c	7858f458-beea-4d68-b101-4f72e865ce85	5	This is new review	asdfasdfasdfsdafddf	2025-06-17 17:04:48.327	2025-06-17 17:04:48.327	\N
4a3f889f-b426-4f3e-b795-68e0a65984e0	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	7858f458-beea-4d68-b101-4f72e865ce85	5	Best course	avails alsdfs aiasdlf asdfsdfasdfasdfsdf	2025-06-17 11:46:45.051	2025-06-17 18:54:31.198	\N
\.


--
-- Data for Name: Enrollment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Enrollment" ("userId", "courseId", "enrolledAt", "accessStatus", "orderItemId") FROM stdin;
7858f458-beea-4d68-b101-4f72e865ce85	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	2025-06-11 11:30:49.486	ACTIVE	fd3e63c2-0928-4e93-b0cc-feab0fddd74a
2ee05674-9115-4f2a-a372-cd7bc4654241	9a8fd49c-d1be-449c-a024-e1e682fc656c	2025-06-16 04:40:41.625	ACTIVE	071001aa-22c4-468d-9b02-5c7b014f52f5
7858f458-beea-4d68-b101-4f72e865ce85	9a8fd49c-d1be-449c-a024-e1e682fc656c	2025-06-16 05:15:40.197	ACTIVE	5660992b-0640-4752-adc6-dd4d0ce3d351
7858f458-beea-4d68-b101-4f72e865ce85	babca687-877c-4f7f-bf3b-47c3c7999fea	2025-06-19 22:25:20.276	ACTIVE	2063b54f-fa89-4238-95c6-2b145a237be2
7858f458-beea-4d68-b101-4f72e865ce85	aed45c50-6425-4d06-958a-4cc56ad3fee9	2025-06-20 09:09:31.036	ACTIVE	9a774f3b-1c74-43cf-92d9-b2b56e7e690b
7858f458-beea-4d68-b101-4f72e865ce85	893833b7-31d4-486a-8cd7-c83a5edb78fd	2025-07-03 08:09:04.36	ACTIVE	6cf4149d-80b0-4467-9692-94076849e72b
2ee05674-9115-4f2a-a372-cd7bc4654241	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	2025-07-05 11:17:52.268	ACTIVE	56495d50-4446-4e1b-a773-9754cf29700f
\.


--
-- Data for Name: InstructorDetails; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InstructorDetails" (id, "userId", "totalStudents", "areaOfExpertise", "professionalExperience", about, website, "createdAt", "updatedAt", status, certifications, cv, education) FROM stdin;
004952e3-aa6d-4eac-a783-37df917bd440	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	0	Web Development, Data Science	John Doe has over 10 years of experience in full-stack web development and data science. He has worked at leading tech companies including Google and Shopify, contributed to open-source projects, and mentored over 1,000 students through online bootcamps. He specializes in Python, React, and machine learning with real-world applications.	Passionate about teaching and technology, I love helping students bridge the gap between theory and real-world application. I believe in project-based learning and continuous improvement.	https://www.rashinkp.dev	2025-06-02 13:06:01.672	2025-06-02 13:07:27.509	APPROVED	- AWS Certified Solutions Architect\n- Google Data Analytics Professional Certificate\n- Certified Scrum Master (CSM)\n	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1748869560556-ABDUL HAMEED K.pdf	- B.Sc. in Computer Science, Stanford University (2012)\n- M.Sc. in Data Science, MIT (2014)
051c604e-951d-471f-bf4e-848fabd95cd5	2ee05674-9115-4f2a-a372-cd7bc4654241	0	asdfasdfasdfasdfasdf	asdfsadfsdaf	asdfasdf	https://www.aaaaaaaaaaaaaaaa.com	2025-06-16 04:52:53.205	2025-06-16 04:52:53.205	PENDING	asdfasdfsdfsdf	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750049572415-Acceptance_of_Job_Offer.pdf	asdfasdf
\.


--
-- Data for Name: Lesson; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lesson" (id, "courseId", title, description, "order", "createdAt", "updatedAt", "deletedAt", status) FROM stdin;
8cb96249-96b8-4a15-aede-21be6c9b1a9b	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Responsive Design with CSS	Explore media queries and layout systems like Flexbox to create responsive web pages.	4	2025-06-02 13:11:29.061	2025-06-02 13:57:02.524	\N	PUBLISHED
9587c059-7de0-4249-b353-931a61d6df54	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Building a Personal Portfolio Website	Apply everything you've learned to build a simple, responsive personal website from scratch.	5	2025-06-02 13:11:42.202	2025-06-02 13:59:01.72	\N	PUBLISHED
7af46dc1-70ba-44a6-b846-98d2af566894	babca687-877c-4f7f-bf3b-47c3c7999fea	lesson 1	alsdkflsdfsd	1	2025-06-05 06:20:01.039	2025-06-05 06:20:43.936	\N	PUBLISHED
fed6fd93-50ff-4c80-b55d-0884926eb689	aed45c50-6425-4d06-958a-4cc56ad3fee9	Getting Started with Data Science	This lesson introduces what data science is, why it's important, and how it is used across industries. It also outlines the data science workflow and tools commonly used in the field.	1	2025-06-12 08:10:07.701	2025-06-12 08:11:17.399	\N	PUBLISHED
1649d1c8-32e9-4c31-8d04-ab382cd0111f	aed45c50-6425-4d06-958a-4cc56ad3fee9	Introduction to Python for Data Science	In this lesson, you’ll learn the basics of Python programming, focusing on syntax and concepts used in data science projects. This forms the foundation for later lessons involving data manipulation and visualization.	2	2025-06-12 08:10:31.841	2025-06-12 08:12:10.97	\N	PUBLISHED
98362185-d797-4f64-a677-db3078d444f4	9a8fd49c-d1be-449c-a024-e1e682fc656c	Principles of Human-Centered and Empathetic Design	Before you start designing beautiful UIs, it’s crucial to understand what makes a design usable and meaningful. This lesson introduces key UX principles like usability, accessibility, hierarchy, and empathy. You'll also learn how to conduct user interviews and gather feedback that actually improves product design.	1	2025-06-13 06:46:11.433	2025-06-13 06:46:38.674	\N	PUBLISHED
2f72f7b7-3145-4c9e-8cae-95b929e49f4c	aed45c50-6425-4d06-958a-4cc56ad3fee9	Final video	dalkfgasdfasdf	3	2025-06-20 08:19:26.155	2025-06-20 08:20:50.076	\N	PUBLISHED
75eb1aa4-ad44-4126-84e3-c4705d89adf3	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Getting Started with HTML	Learn how to structure web content using HTML elements, tags, and attributes.	1	2025-06-02 13:10:55.066	2025-06-02 13:55:16.985	\N	PUBLISHED
4cd336c6-9e7a-4aab-8fde-b3c7bc360379	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Styling with CSS Basics	Understand how to apply styles to your HTML using selectors, colors, fonts, and layout techniques.	2	2025-06-02 13:11:07.152	2025-06-02 13:56:00.282	\N	PUBLISHED
08a5aaf4-7991-408d-8713-6b364ca7a7a2	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Introduction to JavaScript	Get started with JavaScript fundamentals including variables, functions, and basic events.	3	2025-06-02 13:11:17.703	2025-06-02 13:56:35.688	\N	PUBLISHED
\.


--
-- Data for Name: LessonContent; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonContent" (id, "lessonId", type, status, "createdAt", "updatedAt", "deletedAt", "thumbnailUrl", description, "fileUrl", title) FROM stdin;
c760e4d0-18a4-4b0f-948d-4eed031ed24b	75eb1aa4-ad44-4126-84e3-c4705d89adf3	VIDEO	PUBLISHED	2025-06-02 13:54:42.764	2025-06-02 13:55:02.896	\N	https://res.cloudinary.com/dxogdfuse/image/upload/v1748872482/pgiajwgabjyqucjjflxg.png	This content covers the foundational elements of HTML. You'll learn how to structure a webpage using semantic tags like <header>, <nav>, <section>, and <footer>. We will explore how to use headings, paragraphs, lists, links, and images, along with proper nesting and indentation practices. By the end, you’ll build a basic HTML document and understand how content is organized on the web. updatable	https://res.cloudinary.com/dxogdfuse/video/upload/v1748872481/gbk2hwo9qmbwuwtdy2sq.mp4	HTML Basics and Page Structure
cec57b10-3973-4552-a0d9-7b898676b59f	8cb96249-96b8-4a15-aede-21be6c9b1a9b	DOCUMENT	PUBLISHED	2025-06-20 08:19:01.21	2025-06-20 08:19:01.21	\N	\N	This lesson introduces responsive web design using CSS Flexbox. You’ll learn how to arrange elements using flex containers and properties like justify-content, align-items, and flex-wrap. We’ll also apply media queries to adapt the layout across different screen sizes. This content ensures your websites look great on both desktop and mobile.	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750407540760-Application ps.pdf	Building Responsive Layouts with CSS Flexbox
e58d20e2-53ae-4585-afd4-bfdd458ecf92	1649d1c8-32e9-4c31-8d04-ab382cd0111f	DOCUMENT	PUBLISHED	2025-06-12 08:12:07.973	2025-06-20 09:25:17.144	\N	\N	This content covers essential Python elements like variables, data types, conditionals, loops, and functions. You’ll write your first Python script and understand how to run Python code in Jupyter Notebooks—one of the key tools for data science.	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750411516380-Acceptance_of_Job_Offer.pdf	Python Basics for Beginners
81478378-239d-4a2b-bbdd-ec15c438d973	9587c059-7de0-4249-b353-931a61d6df54	QUIZ	PUBLISHED	2025-06-02 13:58:57.282	2025-06-02 13:58:57.282	\N	\N	In the final lesson, you’ll apply everything you’ve learned to build a fully functional personal portfolio. We’ll walk through project setup, structuring multiple HTML pages, linking navigation, styling components, and adding basic JavaScript interactions. You’ll finish with a complete, responsive site that you can host online and showcase to future employers.	\N	Creating and Launching Your Portfolio Website
f92faa96-375f-42f7-bdab-1c586a65e08d	7af46dc1-70ba-44a6-b846-98d2af566894	VIDEO	PUBLISHED	2025-06-05 06:20:40.901	2025-06-05 06:20:40.901	\N	https://res.cloudinary.com/dxogdfuse/image/upload/v1749104441/tp8pvfbjtta5i6hkbo2u.png	content	https://res.cloudinary.com/dxogdfuse/video/upload/v1749104440/ch8ml9qs8dgr9kkrgayx.mp4	new lesson
58a06e7b-c97c-4486-88f5-e3845ed86455	fed6fd93-50ff-4c80-b55d-0884926eb689	VIDEO	PUBLISHED	2025-06-12 08:11:15.016	2025-06-12 08:11:15.016	\N	https://res.cloudinary.com/dxogdfuse/image/upload/v1749715875/wj3thnprcqnuehnmvp3l.webp	In this content, we explore the definition of data science, its evolution, and how it integrates statistics, programming, and domain knowledge. You’ll learn how data scientists approach problems and the lifecycle of a data science project—from data collection to deployment.	https://res.cloudinary.com/dxogdfuse/video/upload/v1749715873/j9nsmomwjyukfls9voqz.mp4	What is Data Science?
883fac23-f548-425d-8532-fe3f977e0825	4cd336c6-9e7a-4aab-8fde-b3c7bc360379	DOCUMENT	PUBLISHED	2025-06-20 08:16:01.216	2025-06-20 08:16:01.216	\N	\N	asdfasdfasdfsdaf	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750407360646-Acceptance_of_Job_Offer.pdf	New title
a0dfa6aa-b461-4ddc-abea-a65106383bff	08a5aaf4-7991-408d-8713-6b364ca7a7a2	DOCUMENT	PUBLISHED	2025-06-20 08:18:03.756	2025-06-20 08:18:03.756	\N	\N	Dive into the basics of JavaScript, the language that powers web interactivity. You’ll learn about variables, data types, functions, and conditionals. Then, we’ll cover event handling to respond to user actions like clicks and keystrokes. This lesson ends with a small interactive example: a button that changes text on click.	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750407483132-Invoice_2073408569.pdf	JavaScript Fundamentals and Interactivity
642a28f0-889a-4d8d-a4f9-b49a1528f1b7	2f72f7b7-3145-4c9e-8cae-95b929e49f4c	VIDEO	PUBLISHED	2025-06-20 08:19:42.787	2025-06-20 08:19:42.787	\N	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750407582527-react-js-programming-language-with-laptop-code-script-screen_1020200-5413.webp	asdfasfdasdf	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750407580406-No Copyright Videos  Moon  Copyright Free  Motion Graphics  Motion Background  Free Video Stock.mp4	asdfasdf
9d7442d6-78e3-468d-b761-91d66bec560a	98362185-d797-4f64-a677-db3078d444f4	DOCUMENT	PUBLISHED	2025-06-20 08:22:32.129	2025-06-20 08:22:32.129	\N	\N	Learn how to create user personas, map user journeys, and define pain points. You'll study psychological principles such as cognitive load and Hick’s Law, and understand how accessibility (color contrast, font choices) plays into usability. Case studies will include apps that failed or succeeded because of UX. Practical assignments include designing an onboarding screen for a productivity app.	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750407751650-Acceptance_of_Job_Offer.pdf	Designing for Real People: Understanding the User
\.


--
-- Data for Name: LessonProgress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."LessonProgress" (id, "enrollmentId", "courseId", "lessonId", completed, "completedAt", "createdAt", "updatedAt", score, "totalQuestions") FROM stdin;
e8599f04-a057-47f3-8ffb-c91df4a06d57	7858f458-beea-4d68-b101-4f72e865ce85	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	75eb1aa4-ad44-4126-84e3-c4705d89adf3	t	\N	2025-06-11 14:54:01.48	2025-06-11 14:54:01.48	\N	\N
9db238e6-4843-4984-a645-319e1b0f2c4e	7858f458-beea-4d68-b101-4f72e865ce85	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	4cd336c6-9e7a-4aab-8fde-b3c7bc360379	t	\N	2025-06-16 05:17:21.759	2025-06-16 05:17:21.759	\N	\N
4238eca9-d626-480a-b9e3-182c626ccac9	7858f458-beea-4d68-b101-4f72e865ce85	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	08a5aaf4-7991-408d-8713-6b364ca7a7a2	t	\N	2025-06-16 05:17:50.662	2025-06-16 05:17:50.662	\N	\N
3813f86a-7c19-4b68-8815-e67fc2463dd1	7858f458-beea-4d68-b101-4f72e865ce85	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	8cb96249-96b8-4a15-aede-21be6c9b1a9b	t	\N	2025-06-20 06:01:53.438	2025-06-20 06:01:53.438	\N	\N
904a8084-3520-498f-befe-3c5341b96898	7858f458-beea-4d68-b101-4f72e865ce85	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	9587c059-7de0-4249-b353-931a61d6df54	t	\N	2025-06-20 06:02:02.399	2025-06-20 06:02:02.399	50	2
592ae1ae-771a-494e-a4a0-1ddf70df7247	7858f458-beea-4d68-b101-4f72e865ce85	9a8fd49c-d1be-449c-a024-e1e682fc656c	98362185-d797-4f64-a677-db3078d444f4	t	\N	2025-06-20 06:54:53.683	2025-06-20 06:54:53.683	\N	\N
25c5f003-2da6-423d-a076-9a0ee770c53a	7858f458-beea-4d68-b101-4f72e865ce85	aed45c50-6425-4d06-958a-4cc56ad3fee9	fed6fd93-50ff-4c80-b55d-0884926eb689	t	\N	2025-06-20 09:23:32.196	2025-06-20 09:23:32.196	\N	\N
2bf7b600-f8f2-4431-81b9-97dbb5dedb20	7858f458-beea-4d68-b101-4f72e865ce85	aed45c50-6425-4d06-958a-4cc56ad3fee9	1649d1c8-32e9-4c31-8d04-ab382cd0111f	t	\N	2025-06-20 09:25:47.246	2025-06-20 09:25:47.246	\N	\N
fdba88f5-11fe-4931-b691-f72003736abc	7858f458-beea-4d68-b101-4f72e865ce85	aed45c50-6425-4d06-958a-4cc56ad3fee9	2f72f7b7-3145-4c9e-8cae-95b929e49f4c	t	\N	2025-06-20 09:25:51.645	2025-06-20 09:25:51.645	\N	\N
c314fe53-4c9e-4de1-b923-3e6fbf44bb9f	2ee05674-9115-4f2a-a372-cd7bc4654241	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	75eb1aa4-ad44-4126-84e3-c4705d89adf3	t	\N	2025-07-05 11:19:24.896	2025-07-05 11:19:24.896	\N	\N
899135ce-cdf9-4754-b276-9785f1fbdd59	2ee05674-9115-4f2a-a372-cd7bc4654241	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	4cd336c6-9e7a-4aab-8fde-b3c7bc360379	t	\N	2025-07-05 11:19:35.861	2025-07-05 11:19:35.861	\N	\N
a1c96892-ffb2-430d-823b-293bfc837b63	2ee05674-9115-4f2a-a372-cd7bc4654241	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	08a5aaf4-7991-408d-8713-6b364ca7a7a2	t	\N	2025-07-05 11:19:39.686	2025-07-05 11:19:39.686	\N	\N
b239250d-76fc-499b-afb2-f0e2721d389b	2ee05674-9115-4f2a-a372-cd7bc4654241	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	8cb96249-96b8-4a15-aede-21be6c9b1a9b	t	\N	2025-07-05 11:19:52.57	2025-07-05 11:19:52.57	\N	\N
e052dcff-c3fd-4dba-8bb1-48c31c244a37	2ee05674-9115-4f2a-a372-cd7bc4654241	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	9587c059-7de0-4249-b353-931a61d6df54	t	\N	2025-07-05 11:20:01.27	2025-07-05 11:20:01.27	50	2
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Message" (id, "chatId", "senderId", content, "createdAt", "audioUrl", "imageUrl", "isRead", type) FROM stdin;
tt9yv2zrd3k	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	Hello	2025-07-05 10:37:59.257	\N	\N	t	TEXT
l18g522ah8j	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	I got a notification that you are interested to our new course webdevelopment!	2025-06-27 09:44:17.183	\N	\N	t	TEXT
4eafu40e3s	f305b687-f835-4c29-8299-9d05e133e79f	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	yes I do.	2025-06-27 09:44:33.987	\N	\N	t	TEXT
jytn4opka2e	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	Then can you give me a bit details about you?	2025-06-27 09:44:57.745	\N	\N	t	TEXT
o6ufzlk9nx	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	and then i will update	2025-06-27 09:45:40.777	\N	\N	t	TEXT
7vkh6siwlou	e8ba8f02-08dc-40d0-baad-52ac75ba577e	e50b51b8-92d1-4c95-886d-dae6766fe13f	Hi rashin	2025-06-27 09:47:23.826	\N	\N	t	TEXT
s1et3unf52	e8ba8f02-08dc-40d0-baad-52ac75ba577e	e50b51b8-92d1-4c95-886d-dae6766fe13f	How are you	2025-06-27 09:47:27.706	\N	\N	t	TEXT
j0iiv9f8cts	e8ba8f02-08dc-40d0-baad-52ac75ba577e	e50b51b8-92d1-4c95-886d-dae6766fe13f	how good is your new course?	2025-06-27 09:47:46.264	\N	\N	t	TEXT
mdhdrs05rwp	e8ba8f02-08dc-40d0-baad-52ac75ba577e	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	Yeah its nice	2025-06-27 09:47:54.728	\N	\N	t	TEXT
w5we37fbsug	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	please contact me when you are ready	2025-06-27 09:45:54.745	\N	\N	t	TEXT
34pbzmqiwk8	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	\N	2025-06-27 10:34:26.343	\N	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1751020465285-Screenshot 2025-06-26 220552.png	t	IMAGE
qha9u64x7e	f305b687-f835-4c29-8299-9d05e133e79f	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	hi	2025-06-27 11:12:27.731	\N	\N	t	TEXT
8pquqa5wqk9	f305b687-f835-4c29-8299-9d05e133e79f	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	hello	2025-06-27 15:37:17.699	\N	\N	t	TEXT
fy2xxtvyfp5	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	\N	2025-06-27 16:12:05.745	\N	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1751040724749-Screenshot 2025-06-22 143650.png	t	IMAGE
s0eam3ixnxa	f305b687-f835-4c29-8299-9d05e133e79f	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	hello	2025-06-28 06:29:27.005	\N	\N	t	TEXT
42d71rgxdqa	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	\N	2025-06-28 14:57:15.511	\N	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1751122635145-react-js-programming-language-with-laptop-code-script-screen_1020200-5413.webp	f	IMAGE
2suznu145ej	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	\N	2025-06-28 15:09:21.674	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1751123361222-audio-1751123361163.webm	\N	f	AUDIO
uqpz89gjh	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	hi	2025-07-03 10:18:31.577	\N	\N	f	TEXT
gujw62rfeuk	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N	2025-07-05 10:38:07.579	\N	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1751711886941-people-holding-connected-copy-space-circle-icons_53876-66230.webp	t	IMAGE
ao7zlxwwevn	8c1439c1-ac4e-4ef7-84f0-408b38a08199	7858f458-beea-4d68-b101-4f72e865ce85	\N	2025-07-05 10:38:24.892	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1751711904423-audio-1751711904369.webm	\N	t	AUDIO
wigva0ma0ga	8c1439c1-ac4e-4ef7-84f0-408b38a08199	7858f458-beea-4d68-b101-4f72e865ce85	\N	2025-07-05 10:40:57.421	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1751712057096-audio-1751712057086.webm	\N	t	AUDIO
bheg9sudnv8	f305b687-f835-4c29-8299-9d05e133e79f	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	Hi, Who is this?	2025-06-27 09:12:57.008	\N	\N	t	TEXT
tdn5gvydr2	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	Hello.. Good Morning...	2025-06-27 09:12:29.595	\N	\N	t	TEXT
umeabkom4g	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	hello	2025-07-08 13:19:14.341	\N	\N	t	TEXT
y8mo7adu6yi	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	how are you	2025-07-08 13:19:16.993	\N	\N	t	TEXT
tctdpbj4fbg	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	are you there	2025-07-08 14:12:12.491	\N	\N	t	TEXT
q7rgn88wjr	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	hello	2025-07-08 14:12:45.975	\N	\N	t	TEXT
dy6esjbuuo	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	hi	2025-07-08 14:15:37.258	\N	\N	t	TEXT
n5lfoiasd4	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	hello	2025-07-08 14:15:42.392	\N	\N	t	TEXT
2mo85hvdyoy	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	how are you	2025-07-08 14:15:45.366	\N	\N	t	TEXT
c1ajxncs3fv	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	i ma here	2025-07-08 14:15:48.454	\N	\N	t	TEXT
s9ao21qo4ti	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	how are you	2025-07-08 14:16:56.037	\N	\N	t	TEXT
knipajniapq	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	mind your business	2025-07-08 14:19:00.429	\N	\N	t	TEXT
7r39lgfafg5	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	asdfsad	2025-07-08 14:25:05.781	\N	\N	t	TEXT
gssf5akvz7j	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	hello	2025-07-08 14:28:38.911	\N	\N	t	TEXT
tbuyhrob8d	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	hello	2025-07-08 15:27:52.27	\N	\N	t	TEXT
kfw3x08zj1s	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	sadfsdaf	2025-07-08 15:28:08.182	\N	\N	t	TEXT
jroc8jynr3o	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	asdfasdf	2025-07-08 15:29:18.537	\N	\N	t	TEXT
bsyf14qyr9s	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	asdfasdf	2025-07-08 15:29:20.612	\N	\N	t	TEXT
3788zoo0v5u	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	asdfasdfasdf	2025-07-08 15:31:26.405	\N	\N	t	TEXT
yl394e6457j	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	asdfasdfsd	2025-07-08 15:31:28.748	\N	\N	t	TEXT
uguijfpq6qm	8c1439c1-ac4e-4ef7-84f0-408b38a08199	e50b51b8-92d1-4c95-886d-dae6766fe13f	sadfsadf	2025-07-08 15:31:29.685	\N	\N	t	TEXT
7gvc49qzfpi	8c1439c1-ac4e-4ef7-84f0-408b38a08199	7858f458-beea-4d68-b101-4f72e865ce85	\N	2025-07-09 07:00:43.316	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1752044441372-audio-1752044441361.webm	\N	f	AUDIO
lg56ggmf9bk	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	\N	2025-07-09 07:22:36.471	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1752045754724-audio-1752045754706.webm	\N	f	AUDIO
sqid8z5446	f305b687-f835-4c29-8299-9d05e133e79f	7858f458-beea-4d68-b101-4f72e865ce85	hh	2025-07-09 07:50:50.607	\N	\N	f	TEXT
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", "eventType", "entityType", "entityId", "entityName", message, link, "createdAt", "expiresAt") FROM stdin;
dd702359-5e93-4246-96fb-29cf5a1c10ca	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	COURSE_APPROVED	COURSE	b4a1add7-3fa9-47cd-96b0-1fe62e9f2808	Kerala PSC	Your course "Kerala PSC" has been approved!	/instructor/courses/b4a1add7-3fa9-47cd-96b0-1fe62e9f2808	2025-06-19 20:53:41.39	2025-09-17 20:53:41.39
ce8e1aeb-eb4e-481c-a9f3-95555b76f843	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	COURSE_DECLINED	COURSE	b4a1add7-3fa9-47cd-96b0-1fe62e9f2808	Kerala PSC	Your course "Kerala PSC" has been declined. Please review and update as needed.	/instructor/courses/b4a1add7-3fa9-47cd-96b0-1fe62e9f2808	2025-06-19 20:57:52.477	2025-09-17 20:57:52.477
3d0e9eb5-c8e8-434b-8bc9-3261480cd594	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	COURSE_APPROVED	COURSE	b4a1add7-3fa9-47cd-96b0-1fe62e9f2808	Kerala PSC	Your course "Kerala PSC" has been approved!	/instructor/courses/b4a1add7-3fa9-47cd-96b0-1fe62e9f2808	2025-06-19 21:00:43.472	2025-09-17 21:00:43.472
d584c827-8d36-4626-9ed5-11a3de9a4d8a	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	COURSE_DECLINED	COURSE	b4a1add7-3fa9-47cd-96b0-1fe62e9f2808	Kerala PSC	Your course "Kerala PSC" has been declined. Please review and update as needed.	/instructor/courses/b4a1add7-3fa9-47cd-96b0-1fe62e9f2808	2025-06-19 21:01:19.441	2025-09-17 21:01:19.441
c087857f-f97c-4ba9-8b40-c5da1a69f605	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	COURSE_APPROVED	COURSE	893833b7-31d4-486a-8cd7-c83a5edb78fd	another	Your course "another" has been approved!	/instructor/courses/893833b7-31d4-486a-8cd7-c83a5edb78fd	2025-06-19 22:04:28.862	2025-09-17 22:04:28.862
5c7721bb-d8c4-43ac-98f8-ab6ec83cd69c	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	COURSE_DISABLED	COURSE	893833b7-31d4-486a-8cd7-c83a5edb78fd	another	Your course "another" has been disabled and is no longer available to students.	/instructor/courses/893833b7-31d4-486a-8cd7-c83a5edb78fd	2025-06-19 22:04:38.252	2025-09-17 22:04:38.252
f180fe0c-46e5-40f9-b291-f44762fb43a1	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	COURSE_ENABLED	COURSE	893833b7-31d4-486a-8cd7-c83a5edb78fd	another	Your course "another" has been enabled and is now available to students.	/instructor/courses/893833b7-31d4-486a-8cd7-c83a5edb78fd	2025-06-19 22:04:43.292	2025-09-17 22:04:43.292
0cf59fe7-5da3-4795-b079-55e13e93d252	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	REVENUE_EARNED	PAYMENT	babca687-877c-4f7f-bf3b-47c3c7999fea	React JS – From Zero to Hero	Revenue earned: $43.20 from course "React JS – From Zero to Hero" purchase.	/instructor/wallet	2025-06-19 22:25:20.331	2025-09-17 22:25:20.331
14693603-3463-437a-9050-ce25b2e06a3b	e50b51b8-92d1-4c95-886d-dae6766fe13f	REVENUE_EARNED	PAYMENT	babca687-877c-4f7f-bf3b-47c3c7999fea	React JS – From Zero to Hero	Revenue earned: $10.80 from course "React JS – From Zero to Hero" purchase.	/admin/wallet	2025-06-19 22:25:20.334	2025-09-17 22:25:20.334
09361604-db9a-4a1d-953c-87100d8e19e5	7858f458-beea-4d68-b101-4f72e865ce85	COURSE_PURCHASED	COURSE	babca687-877c-4f7f-bf3b-47c3c7999fea	React JS – From Zero to Hero	Course "React JS – From Zero to Hero" purchase completed! You're ready to start learning.	/user/my-courses	2025-06-19 22:25:20.337	2025-09-17 22:25:20.337
159cc5c5-9198-4db7-b907-ca4e5652b759	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	REVENUE_EARNED	PAYMENT	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Introduction to Web Development	Revenue earned: $31.99 from course "Introduction to Web Development" purchase.	/instructor/wallet	2025-06-19 22:33:09.115	2025-09-17 22:33:09.115
7e4327e1-7b86-4b00-9d3b-b6a64fbb52f0	e50b51b8-92d1-4c95-886d-dae6766fe13f	REVENUE_EARNED	PAYMENT	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Introduction to Web Development	Revenue earned: $8.00 from course "Introduction to Web Development" purchase.	/admin/wallet	2025-06-19 22:33:09.119	2025-09-17 22:33:09.119
241aa6e9-7e2a-43d7-a947-e836b1a89b27	2ee05674-9115-4f2a-a372-cd7bc4654241	COURSE_PURCHASED	COURSE	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Introduction to Web Development	Course "Introduction to Web Development" purchase completed! You're ready to start learning.	/user/my-courses	2025-06-19 22:33:09.123	2025-09-17 22:33:09.123
c2613a3e-3647-45a8-ae58-ab2c454e8f30	2ee05674-9115-4f2a-a372-cd7bc4654241	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message: Hello	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-19 22:46:24.479	2025-09-17 22:46:24.479
8543a998-a7d1-4f66-a877-624b000631ac	7858f458-beea-4d68-b101-4f72e865ce85	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message: Hi	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-19 22:48:49.171	2025-09-17 22:48:49.171
0d647ed7-b91a-4104-b6b9-5b7f6626dfa5	2ee05674-9115-4f2a-a372-cd7bc4654241	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message: how are you	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-19 22:49:21.904	2025-09-17 22:49:21.904
1cfc9786-c0c3-4a4b-af4a-ee3d19c4bfed	7858f458-beea-4d68-b101-4f72e865ce85	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message: fine	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-19 22:49:28.905	2025-09-17 22:49:28.905
350808bf-1b3e-4071-bc24-afd20c64dc8d	2ee05674-9115-4f2a-a372-cd7bc4654241	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message: can you please help me for my studies?	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-19 22:50:06.261	2025-09-17 22:50:06.261
4106d529-7b1f-4479-b626-c2577d36cdc6	7858f458-beea-4d68-b101-4f72e865ce85	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message: sure happy to do	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-19 22:50:26.143	2025-09-17 22:50:26.143
b62e057f-ecfe-4f0c-8937-dda4644e49b6	2ee05674-9115-4f2a-a372-cd7bc4654241	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message: Thanks a lottt!!!!!.	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-19 22:52:03.502	2025-09-17 22:52:03.502
95947297-47f3-4f34-9fb7-86965dcdd33c	7858f458-beea-4d68-b101-4f72e865ce85	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message: Its my pleasure	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-19 22:52:47.658	2025-09-17 22:52:47.658
4f57a704-3c54-49c9-ab5c-3eda0915e2e9	2ee05674-9115-4f2a-a372-cd7bc4654241	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message: So which are you focusign on?	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-19 22:53:51.551	2025-09-17 22:53:51.551
39f00a6d-34e5-43a7-aca1-b56fdb6e354e	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	REVENUE_EARNED	PAYMENT	aed45c50-6425-4d06-958a-4cc56ad3fee9	Introduction to Data Science	Revenue earned: $31.99 from course "Introduction to Data Science" purchase.	/instructor/wallet	2025-06-20 09:09:31.308	2025-09-18 09:09:31.308
a7db1093-db7f-4ca5-afd5-27298d287bbf	e50b51b8-92d1-4c95-886d-dae6766fe13f	REVENUE_EARNED	PAYMENT	aed45c50-6425-4d06-958a-4cc56ad3fee9	Introduction to Data Science	Revenue earned: $8.00 from course "Introduction to Data Science" purchase.	/admin/wallet	2025-06-20 09:09:31.316	2025-09-18 09:09:31.316
849437d2-453e-4ad6-8f11-66bc895c58f5	7858f458-beea-4d68-b101-4f72e865ce85	COURSE_PURCHASED	COURSE	aed45c50-6425-4d06-958a-4cc56ad3fee9	Introduction to Data Science	Course "Introduction to Data Science" purchase completed! You're ready to start learning.	/user/my-courses	2025-06-20 09:09:31.32	2025-09-18 09:09:31.32
12d76779-e307-4264-ac27-1d8a565478d8	7858f458-beea-4d68-b101-4f72e865ce85	NEW_MESSAGE	CHAT	b9aad26f-839b-49aa-b2ed-a98e553a4717	Chat	You have received a new message from Someone: hello	/chat/b9aad26f-839b-49aa-b2ed-a98e553a4717	2025-06-20 09:22:11.431	2025-09-18 09:22:11.431
2147feeb-b93b-4436-9b7f-4af557f75bcc	2ee05674-9115-4f2a-a372-cd7bc4654241	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message from Someone: hello	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-23 17:34:15.067	2025-09-21 17:34:15.067
f8fc87a5-3722-4c65-868c-ed890b9f291c	2ee05674-9115-4f2a-a372-cd7bc4654241	NEW_MESSAGE	CHAT	8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	Chat	You have received a new message from Someone: hi	/chat/8d1824f2-33dc-456e-b3c7-54dcd2c33b8f	2025-06-23 17:39:18.144	2025-09-21 17:39:18.144
8399c610-4a73-4a72-b091-a4ab43ac3d7f	e50b51b8-92d1-4c95-886d-dae6766fe13f	COURSE_CREATION	COURSE	41097c8c-8399-431a-9218-6eb3372864e0	;lkasdfsdf	A new course ";lkasdfsdf" has been created.	/admin/courses/41097c8c-8399-431a-9218-6eb3372864e0	2025-06-26 04:42:14.84	2025-09-24 04:42:14.84
709f9432-1660-48c0-8215-c082810158c4	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	NEW_MESSAGE	CHAT	b9aad26f-839b-49aa-b2ed-a98e553a4717	Chat	You have received a new message from Someone: hello are you there	/chat/b9aad26f-839b-49aa-b2ed-a98e553a4717	2025-06-26 06:58:03.483	2025-09-24 06:58:03.483
68b5b6bb-4798-4923-9418-11e76b29d7b1	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	REVENUE_EARNED	PAYMENT	893833b7-31d4-486a-8cd7-c83a5edb78fd	another	Revenue earned: $16.80 from course "another" purchase.	/instructor/wallet	2025-07-03 08:09:04.458	2025-10-01 08:09:04.458
e403a7e0-27d3-4fba-b4e5-c7b6e6f4221d	e50b51b8-92d1-4c95-886d-dae6766fe13f	REVENUE_EARNED	PAYMENT	893833b7-31d4-486a-8cd7-c83a5edb78fd	another	Revenue earned: $4.20 from course "another" purchase.	/admin/wallet	2025-07-03 08:09:04.462	2025-10-01 08:09:04.462
e50d3478-3be6-42ec-ac4c-473ba2d35335	7858f458-beea-4d68-b101-4f72e865ce85	COURSE_PURCHASED	COURSE	893833b7-31d4-486a-8cd7-c83a5edb78fd	another	Course "another" purchase completed! You're ready to start learning.	/user/my-courses	2025-07-03 08:09:04.464	2025-10-01 08:09:04.464
18fea3d8-a945-4d2a-850b-c0652541812d	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 04:46:36.221	2025-10-03 04:46:36.221
a409ec88-4e8a-4f4c-8b98-c4b8a0f98ebb	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	USER_DISABLED	USER	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	Rashin kp	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 04:52:42.058	2025-10-03 04:52:42.058
e9f1813d-18a6-415f-bc9c-7cee447bc64a	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 05:08:00.175	2025-10-03 05:08:00.175
48ae3d7b-9095-4516-b316-614663358410	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 05:08:12.054	2025-10-03 05:08:12.054
cc377887-9e41-40a6-b6e2-ae02deb0ab53	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 05:38:14.848	2025-10-03 05:38:14.848
7e423bf2-fe48-40be-b24a-d87c8b7ff49b	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	USER_ENABLED	USER	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	Rashin kp	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 05:38:58.145	2025-10-03 05:38:58.145
7357ec05-1ea1-4f45-b384-61d89afd5eae	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 05:39:06.01	2025-10-03 05:39:06.01
ccf7c722-0cd8-4d1b-bb0b-1f5f4b1d9d3a	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 05:43:04.262	2025-10-03 05:43:04.262
8f269d4e-164d-40d3-bb50-f290d52761d5	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 06:40:18.575	2025-10-03 06:40:18.575
bf0faa05-bfce-4151-a01c-c9f8e984d515	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 06:46:57.847	2025-10-03 06:46:57.847
bdaeeb78-ea35-4529-bb07-48c20dacc6f5	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 06:47:12.851	2025-10-03 06:47:12.851
fa000578-bc25-4c4b-b656-08b2248fb43d	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 09:12:40.672	2025-10-03 09:12:40.672
cebc3b4d-53f6-4d89-8078-c73479de2d73	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 09:13:01.702	2025-10-03 09:13:01.702
a5293748-eb94-46ef-933e-c1005b1dbd99	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 09:14:13.322	2025-10-03 09:14:13.322
79d1dcf7-0767-4692-8bbe-92555c184fa2	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 09:19:41.988	2025-10-03 09:19:41.988
6563b082-c440-4cab-9993-b825b1eea2e1	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 09:33:53.797	2025-10-03 09:33:53.797
b26c0375-5374-4b8a-a637-2e66708a03db	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 09:34:04.054	2025-10-03 09:34:04.054
f0127eb4-f6d7-4721-80b8-84448cd88119	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 09:34:15.852	2025-10-03 09:34:15.852
f93c4c50-3090-4c52-9cdc-7f53d65e2ab5	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 09:34:25.239	2025-10-03 09:34:25.239
1319b5f0-991f-4294-bcdb-64a558c3d962	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 09:35:11.504	2025-10-03 09:35:11.504
4e09a003-194c-471d-af65-56cf7c552a4d	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 09:35:25.448	2025-10-03 09:35:25.448
45727699-d3e9-4992-9aaf-0b11ff24f45a	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 09:42:48.579	2025-10-03 09:42:48.579
5503e5a1-28a6-45dd-a604-f1d7b78ddc9a	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 09:43:00.941	2025-10-03 09:43:00.941
022c56a5-ee2c-4f82-8954-76940e9a4563	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 10:04:02.023	2025-10-03 10:04:02.023
410989cf-662a-4345-a766-4a49297d1e9f	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-05 10:19:15.637	2025-10-03 10:19:15.637
85a7f91a-b29a-4758-a147-68dbc7a9aacb	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-05 10:23:31.81	2025-10-03 10:23:31.81
c8211dec-bb83-450b-a825-e281f1293b45	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	REVENUE_EARNED	PAYMENT	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Introduction to Web Development	Revenue earned: $31.99 from course "Introduction to Web Development" purchase.	/instructor/wallet	2025-07-05 11:17:52.491	2025-10-03 11:17:52.491
5d19e9a5-80db-4c15-9b2e-8df65bf8a370	e50b51b8-92d1-4c95-886d-dae6766fe13f	REVENUE_EARNED	PAYMENT	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Introduction to Web Development	Revenue earned: $8.00 from course "Introduction to Web Development" purchase.	/admin/wallet	2025-07-05 11:17:52.51	2025-10-03 11:17:52.51
75f9b19b-bc6e-4286-a6e4-68bef5290627	2ee05674-9115-4f2a-a372-cd7bc4654241	COURSE_PURCHASED	COURSE	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	Introduction to Web Development	Course "Introduction to Web Development" purchase completed! You're ready to start learning.	/user/my-courses	2025-07-05 11:17:52.537	2025-10-03 11:17:52.537
282e46e2-1547-45fd-8c6a-c7d36d7ad9e9	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 08:33:19.704	2025-10-04 08:33:19.704
8c408f51-4071-4fa9-b6ab-0d1020f0248b	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 08:35:44.129	2025-10-04 08:35:44.129
490a1965-99ea-4885-9232-e01013b8cecf	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 08:37:30.536	2025-10-04 08:37:30.536
a1130a9b-27b4-48e4-bb32-71359e96448c	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 08:42:54.402	2025-10-04 08:42:54.402
f96b62fe-a58f-408a-ba3a-baf6d1f8046c	2ee05674-9115-4f2a-a372-cd7bc4654241	USER_DISABLED	USER	2ee05674-9115-4f2a-a372-cd7bc4654241	sample 	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 08:44:26.209	2025-10-04 08:44:26.209
7a1f1624-ade1-4def-adfd-14eb2b97f9e5	2ee05674-9115-4f2a-a372-cd7bc4654241	USER_ENABLED	USER	2ee05674-9115-4f2a-a372-cd7bc4654241	sample 	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 08:45:04.297	2025-10-04 08:45:04.297
c729390d-08fc-44ae-a270-25e53e3d17c5	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 08:45:05.953	2025-10-04 08:45:05.953
90a2ebe0-c02c-4171-95b8-a12d770e534b	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 08:47:57.294	2025-10-04 08:47:57.294
f97c7dac-1162-46f8-ae8a-7525ba105fff	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 08:48:08.892	2025-10-04 08:48:08.892
e5693433-ff29-46e4-b5bb-907a46f6e7c7	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 08:59:57.634	2025-10-04 08:59:57.634
f119f477-4ced-4b0b-8bb6-99e8909b6f7f	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 09:00:44.234	2025-10-04 09:00:44.234
37e575cd-d40e-4594-853d-7d2c7558b299	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 09:12:56.854	2025-10-04 09:12:56.854
bb7b3efc-d288-4972-ac31-dd5c0b7fd617	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 09:13:05.438	2025-10-04 09:13:05.438
f274cf8e-8558-4df2-9fcf-7f1f4f9e9373	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 09:22:23.815	2025-10-04 09:22:23.815
0457f575-7e46-413a-a8b5-83c04bd4d8f9	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 09:22:34.683	2025-10-04 09:22:34.683
19429114-7e93-4600-87ed-a5d86f4deebe	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 09:24:53.642	2025-10-04 09:24:53.642
081ca39c-37e3-4b22-acb5-4a0a102a0a86	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 09:25:19.893	2025-10-04 09:25:19.893
3f602c1e-dcae-4b7d-8963-df6ceea55a1e	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 09:29:40.694	2025-10-04 09:29:40.694
1365765e-4532-458f-b5d1-0c5c6c316454	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 09:29:50.339	2025-10-04 09:29:50.339
ee96560b-6485-4073-80fa-8fd9f22412fa	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 09:32:09.823	2025-10-04 09:32:09.823
c16849e7-d613-415e-bbfb-37e0bfd99287	7858f458-beea-4d68-b101-4f72e865ce85	USER_DISABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been disabled by an administrator. If you believe this is a mistake, please contact support.	/login	2025-07-06 09:32:24.336	2025-10-04 09:32:24.336
125a7092-df19-4d24-86e1-f9d666bd319c	7858f458-beea-4d68-b101-4f72e865ce85	USER_ENABLED	USER	7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	Your account has been re-enabled. You can now access the platform again.	/login	2025-07-06 09:35:23.99	2025-10-04 09:35:23.99
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Order" (id, "userId", amount, "paymentStatus", "paymentGateway", "paymentId", "orderStatus", "createdAt", "updatedAt", "deletedAt") FROM stdin;
65958d78-a15c-4a88-b494-bcf0f385f938	2ee05674-9115-4f2a-a372-cd7bc4654241	39.990000000000000000000000000000	COMPLETED	STRIPE	pi_3Rbr15C2HBihydxY13KJDRbh	COMPLETED	2025-06-19 22:32:59.704	2025-06-19 22:33:09.064	\N
edce1dc3-ec7b-4537-a9e6-61a441358cdc	7858f458-beea-4d68-b101-4f72e865ce85	39.990000000000000000000000000000	COMPLETED	STRIPE	pi_3Rc0wvC2HBihydxY1BoXHrN1	COMPLETED	2025-06-20 09:09:17.293	2025-06-20 09:09:30.987	\N
0d9f1bb4-cc2e-4bff-ab3c-d987d1f92da3	7858f458-beea-4d68-b101-4f72e865ce85	21.000000000000000000000000000000	COMPLETED	WALLET	84ff3eda-8210-4798-b797-969ab21c4d58	COMPLETED	2025-07-03 08:09:04.251	2025-07-03 08:09:04.351	\N
ae6aabe2-2514-4503-86b5-97b6c9dc2e72	7858f458-beea-4d68-b101-4f72e865ce85	21.000000000000000000000000000000	COMPLETED	WALLET	47bf1917-9d11-4bad-ad12-8ded16ac18e8	COMPLETED	2025-07-03 08:15:20.048	2025-07-03 08:15:20.077	\N
8bb00700-439b-4e1b-907f-d65c4b263f6c	7858f458-beea-4d68-b101-4f72e865ce85	21.000000000000000000000000000000	PENDING	WALLET	\N	PENDING	2025-07-03 08:15:28.635	2025-07-03 08:15:28.635	\N
92116ada-7bd0-4e95-862a-da70e8ebda54	7858f458-beea-4d68-b101-4f72e865ce85	21.000000000000000000000000000000	PENDING	STRIPE	\N	PENDING	2025-07-03 08:20:10.026	2025-07-03 08:20:10.026	\N
a8fcc6f8-f4fc-4c67-9382-9d624e167529	2ee05674-9115-4f2a-a372-cd7bc4654241	39.990000000000000000000000000000	COMPLETED	STRIPE	pi_3RhU6NC2HBihydxY1QxvJldS	COMPLETED	2025-07-05 11:17:33.067	2025-07-05 11:17:52.22	\N
171311a1-2290-4426-9093-95fac9d715ec	7858f458-beea-4d68-b101-4f72e865ce85	39.990000000000000000000000000000	COMPLETED	WALLET	9ab9e8f9-88ec-430e-99ce-e4def95a2563	COMPLETED	2025-06-11 11:30:49.4	2025-06-11 11:30:49.479	\N
02fefc25-e68d-4c71-a126-dcafd465b3c7	2ee05674-9115-4f2a-a372-cd7bc4654241	59.000000000000000000000000000000	COMPLETED	STRIPE	pi_3RaUqbC2HBihydxY1uXjv4p9	COMPLETED	2025-06-16 04:40:31.485	2025-06-16 04:40:41.618	\N
d495ed83-29d9-4655-b07a-f9e3ba1590f4	7858f458-beea-4d68-b101-4f72e865ce85	59.000000000000000000000000000000	COMPLETED	STRIPE	pi_3RaVOQC2HBihydxY1wfJEpHH	COMPLETED	2025-06-16 05:14:29.066	2025-06-16 05:15:40.18	\N
5f43050f-4f4e-40be-9ac2-8cbb9a677194	7858f458-beea-4d68-b101-4f72e865ce85	54.000000000000000000000000000000	COMPLETED	STRIPE	pi_3RbqtWC2HBihydxY0o10yeDA	COMPLETED	2025-06-19 22:25:09.192	2025-06-19 22:25:20.268	\N
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderItem" (id, "orderId", "courseId", "coursePrice", discount, "couponId", "createdAt", "updatedAt", "courseTitle", "adminSharePercentage") FROM stdin;
fd3e63c2-0928-4e93-b0cc-feab0fddd74a	171311a1-2290-4426-9093-95fac9d715ec	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	39.990000000000000000000000000000	10.000000000000000000000000000000	\N	2025-06-11 11:30:49.407	2025-06-11 11:30:49.407	Introduction to Web Development	20.000000000000000000000000000000
071001aa-22c4-468d-9b02-5c7b014f52f5	02fefc25-e68d-4c71-a126-dcafd465b3c7	9a8fd49c-d1be-449c-a024-e1e682fc656c	59.000000000000000000000000000000	20.000000000000000000000000000000	\N	2025-06-16 04:40:31.495	2025-06-16 04:40:31.495	Mastering UI/UX Design	20.000000000000000000000000000000
5660992b-0640-4752-adc6-dd4d0ce3d351	d495ed83-29d9-4655-b07a-f9e3ba1590f4	9a8fd49c-d1be-449c-a024-e1e682fc656c	59.000000000000000000000000000000	20.000000000000000000000000000000	\N	2025-06-16 05:14:29.074	2025-06-16 05:14:29.074	Mastering UI/UX Design	20.000000000000000000000000000000
2063b54f-fa89-4238-95c6-2b145a237be2	5f43050f-4f4e-40be-9ac2-8cbb9a677194	babca687-877c-4f7f-bf3b-47c3c7999fea	54.000000000000000000000000000000	35.000000000000000000000000000000	\N	2025-06-19 22:25:09.212	2025-06-19 22:25:09.212	React JS – From Zero to Hero	20.000000000000000000000000000000
73114569-c213-42f9-bebc-1d01fe60d5e3	65958d78-a15c-4a88-b494-bcf0f385f938	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	39.990000000000000000000000000000	0.009999999999998010000000000000	\N	2025-06-19 22:32:59.708	2025-06-19 22:32:59.708	Introduction to Web Development	20.000000000000000000000000000000
9a774f3b-1c74-43cf-92d9-b2b56e7e690b	edce1dc3-ec7b-4537-a9e6-61a441358cdc	aed45c50-6425-4d06-958a-4cc56ad3fee9	39.990000000000000000000000000000	20.000000000000000000000000000000	\N	2025-06-20 09:09:17.31	2025-06-20 09:09:17.31	Introduction to Data Science	20.000000000000000000000000000000
6cf4149d-80b0-4467-9692-94076849e72b	0d9f1bb4-cc2e-4bff-ab3c-d987d1f92da3	893833b7-31d4-486a-8cd7-c83a5edb78fd	21.000000000000000000000000000000	0.000000000000000000000000000000	\N	2025-07-03 08:09:04.289	2025-07-03 08:09:04.289	another	20.000000000000000000000000000000
16771159-262b-4764-8946-0aff9751c288	ae6aabe2-2514-4503-86b5-97b6c9dc2e72	893833b7-31d4-486a-8cd7-c83a5edb78fd	21.000000000000000000000000000000	0.000000000000000000000000000000	\N	2025-07-03 08:15:20.055	2025-07-03 08:15:20.055	another	20.000000000000000000000000000000
16b1905f-d9ee-4bf8-a5df-9065f367a2e6	8bb00700-439b-4e1b-907f-d65c4b263f6c	893833b7-31d4-486a-8cd7-c83a5edb78fd	21.000000000000000000000000000000	0.000000000000000000000000000000	\N	2025-07-03 08:15:28.637	2025-07-03 08:15:28.637	another	20.000000000000000000000000000000
371e7daf-b024-4694-9678-de4ff8034767	92116ada-7bd0-4e95-862a-da70e8ebda54	893833b7-31d4-486a-8cd7-c83a5edb78fd	21.000000000000000000000000000000	0.000000000000000000000000000000	\N	2025-07-03 08:20:10.029	2025-07-03 08:20:10.029	another	20.000000000000000000000000000000
56495d50-4446-4e1b-a773-9754cf29700f	a8fcc6f8-f4fc-4c67-9382-9d624e167529	8aa5a5aa-a1a6-4891-8a49-d46e52deceb9	39.990000000000000000000000000000	0.009999999999998010000000000000	\N	2025-07-05 11:17:33.093	2025-07-05 11:17:33.093	Introduction to Web Development	20.000000000000000000000000000000
\.


--
-- Data for Name: QuizAnswer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuizAnswer" (id, "lessonProgressId", "quizQuestionId", "selectedAnswer", "isCorrect", "createdAt", "updatedAt") FROM stdin;
ff0b923f-927e-497c-ba6d-3cfe8428197f	904a8084-3520-498f-befe-3c5341b96898	3501241e-c839-4705-a351-04e524a73c87	Hyper Trainer Marking Language	f	2025-06-20 06:02:02.413	2025-06-20 06:02:02.413
ddcd1567-81ae-40b3-beed-6e88b6146408	904a8084-3520-498f-befe-3c5341b96898	85b5a827-7df7-4981-94e1-ef2ad2aaea8f	<img>	t	2025-06-20 06:02:02.413	2025-06-20 06:02:02.413
4ea24805-5631-4ca0-b255-d09b60fdb021	e052dcff-c3fd-4dba-8bb1-48c31c244a37	3501241e-c839-4705-a351-04e524a73c87	Hyper Trainer Marking Language	f	2025-07-05 11:20:01.327	2025-07-05 11:20:01.327
f19e161b-3831-4a15-9896-53f2472ea577	e052dcff-c3fd-4dba-8bb1-48c31c244a37	85b5a827-7df7-4981-94e1-ef2ad2aaea8f	<img>	t	2025-07-05 11:20:01.328	2025-07-05 11:20:01.328
\.


--
-- Data for Name: QuizQuestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuizQuestion" (id, "lessonContentId", question, options, "correctAnswer", "createdAt", "updatedAt") FROM stdin;
3501241e-c839-4705-a351-04e524a73c87	81478378-239d-4a2b-bbdd-ec15c438d973	What does HTML stand for?	{"Hyper Trainer Marking Language","Hyper Text Markup Language","Hyperlinks and Text Markup Language","Home Tool Markup Language"}	Hyper Text Markup Language	2025-06-02 13:59:01.724	2025-06-02 13:59:01.724
85b5a827-7df7-4981-94e1-ef2ad2aaea8f	81478378-239d-4a2b-bbdd-ec15c438d973	Which HTML tag is used to insert an image?	{<img>,<image>,<src>,<pic>}	<img>	2025-06-02 13:59:01.724	2025-06-02 13:59:01.724
\.


--
-- Data for Name: Refund; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Refund" (id, "userId", "courseId", amount, reason, status, "transactionId", "createdAt", "updatedAt", "orderItemId") FROM stdin;
\.


--
-- Data for Name: TransactionHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."TransactionHistory" (id, "orderId", "userId", "courseId", amount, "paymentGateway", "transactionId", "createdAt", "updatedAt", type, status, "walletId", metadata, "paymentDetails", "paymentMethod") FROM stdin;
5ab35cbd-a44a-418c-b0bd-64165101daf0	edce1dc3-ec7b-4537-a9e6-61a441358cdc	7858f458-beea-4d68-b101-4f72e865ce85	\N	39.99	STRIPE	\N	2025-06-20 09:09:17.333	2025-06-20 09:09:30.968	PURCHASE	COMPLETED	\N	\N	\N	STRIPE
3862d3ae-e961-4270-b472-75f844bbd610	edce1dc3-ec7b-4537-a9e6-61a441358cdc	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N	7.998000000000001	INTERNAL	\N	2025-06-20 09:09:31.249	2025-06-20 09:09:31.249	REVENUE	COMPLETED	\N	\N	\N	\N
6eb7209f-766d-4d8c-88cf-357334b5b2a3	edce1dc3-ec7b-4537-a9e6-61a441358cdc	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	\N	31.992	INTERNAL	\N	2025-06-20 09:09:31.275	2025-06-20 09:09:31.275	REVENUE	COMPLETED	\N	\N	\N	\N
9ab9e8f9-88ec-430e-99ce-e4def95a2563	171311a1-2290-4426-9093-95fac9d715ec	7858f458-beea-4d68-b101-4f72e865ce85	\N	39.99	WALLET	\N	2025-06-11 11:30:49.476	2025-06-11 11:30:49.476	PURCHASE	COMPLETED	\N	\N	\N	\N
c3fc7d42-338e-498f-a30b-0184817d76ab	171311a1-2290-4426-9093-95fac9d715ec	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N	7.998000000000001	INTERNAL	\N	2025-06-11 11:30:49.663	2025-06-11 11:30:49.663	REVENUE	COMPLETED	\N	\N	\N	\N
241d2463-b961-4e1a-acb6-d291378ef287	171311a1-2290-4426-9093-95fac9d715ec	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	\N	31.992	INTERNAL	\N	2025-06-11 11:30:49.665	2025-06-11 11:30:49.665	REVENUE	COMPLETED	\N	\N	\N	\N
6a0d81ca-892e-4966-a959-ecbaef271956	02fefc25-e68d-4c71-a126-dcafd465b3c7	2ee05674-9115-4f2a-a372-cd7bc4654241	\N	59	STRIPE	\N	2025-06-16 04:40:31.512	2025-06-16 04:40:41.609	PURCHASE	COMPLETED	\N	\N	\N	STRIPE
9b1bf3b7-34af-4102-bc75-67d9e5b9dfc8	02fefc25-e68d-4c71-a126-dcafd465b3c7	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N	11.8	INTERNAL	\N	2025-06-16 04:40:41.664	2025-06-16 04:40:41.664	REVENUE	COMPLETED	\N	\N	\N	\N
7517dad2-a619-46d1-87a6-980b2344fdfc	02fefc25-e68d-4c71-a126-dcafd465b3c7	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	\N	47.2	INTERNAL	\N	2025-06-16 04:40:41.668	2025-06-16 04:40:41.668	REVENUE	COMPLETED	\N	\N	\N	\N
e00b941c-f21e-4b24-99a5-66f4a6a97b6d	d495ed83-29d9-4655-b07a-f9e3ba1590f4	7858f458-beea-4d68-b101-4f72e865ce85	\N	59	STRIPE	\N	2025-06-16 05:14:29.101	2025-06-16 05:15:40.108	PURCHASE	COMPLETED	\N	\N	\N	STRIPE
63e044ad-12e8-4bfb-abfd-29b2c1e9ae16	d495ed83-29d9-4655-b07a-f9e3ba1590f4	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N	11.8	INTERNAL	\N	2025-06-16 05:15:40.434	2025-06-16 05:15:40.434	REVENUE	COMPLETED	\N	\N	\N	\N
709f9837-6c29-4b5e-ab80-2c8f7fcd6251	d495ed83-29d9-4655-b07a-f9e3ba1590f4	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	\N	47.2	INTERNAL	\N	2025-06-16 05:15:40.443	2025-06-16 05:15:40.443	REVENUE	COMPLETED	\N	\N	\N	\N
ea56c751-891c-4b97-806d-4a8cba33c271	5f43050f-4f4e-40be-9ac2-8cbb9a677194	7858f458-beea-4d68-b101-4f72e865ce85	\N	54	STRIPE	\N	2025-06-19 22:25:09.236	2025-06-19 22:25:20.257	PURCHASE	COMPLETED	\N	\N	\N	STRIPE
a76a274c-0249-42ba-8cc3-b689967f51a7	5f43050f-4f4e-40be-9ac2-8cbb9a677194	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N	10.8	INTERNAL	\N	2025-06-19 22:25:20.313	2025-06-19 22:25:20.313	REVENUE	COMPLETED	\N	\N	\N	\N
4f114e85-3562-4b22-9941-861cbe8ddd26	5f43050f-4f4e-40be-9ac2-8cbb9a677194	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	\N	43.2	INTERNAL	\N	2025-06-19 22:25:20.316	2025-06-19 22:25:20.316	REVENUE	COMPLETED	\N	\N	\N	\N
7ed676d6-065b-43d1-a547-a226c76ceadd	65958d78-a15c-4a88-b494-bcf0f385f938	2ee05674-9115-4f2a-a372-cd7bc4654241	\N	39.99	STRIPE	\N	2025-06-19 22:32:59.8	2025-06-19 22:33:09.055	PURCHASE	COMPLETED	\N	\N	\N	STRIPE
97fa76ac-a165-4b99-88b6-33d4d85a8e3a	65958d78-a15c-4a88-b494-bcf0f385f938	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N	7.998000000000001	INTERNAL	\N	2025-06-19 22:33:09.102	2025-06-19 22:33:09.102	REVENUE	COMPLETED	\N	\N	\N	\N
2075396a-5a5d-45fe-87cd-88e88524380c	65958d78-a15c-4a88-b494-bcf0f385f938	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	\N	31.992	INTERNAL	\N	2025-06-19 22:33:09.107	2025-06-19 22:33:09.107	REVENUE	COMPLETED	\N	\N	\N	\N
6570bb94-813d-44ec-943b-d94808473692	\N	7858f458-beea-4d68-b101-4f72e865ce85	\N	10	STRIPE	\N	2025-06-25 11:36:29.046	2025-06-25 11:36:40.584	WALLET_TOPUP	COMPLETED	\N	{"description": "Wallet top-up", "isWalletTopUp": true}	\N	STRIPE
8c3d946b-87b3-458c-a92c-2496ba639012	\N	7858f458-beea-4d68-b101-4f72e865ce85	\N	10	STRIPE	\N	2025-07-02 13:50:53.108	2025-07-02 13:50:53.108	WALLET_TOPUP	PENDING	\N	{"description": "Wallet top-up", "isWalletTopUp": true}	\N	STRIPE
84ff3eda-8210-4798-b797-969ab21c4d58	0d9f1bb4-cc2e-4bff-ab3c-d987d1f92da3	7858f458-beea-4d68-b101-4f72e865ce85	\N	21	WALLET	\N	2025-07-03 08:09:04.341	2025-07-03 08:09:04.341	PURCHASE	COMPLETED	\N	\N	\N	\N
5224cd58-1f73-475c-b1d4-6505883d9f9e	0d9f1bb4-cc2e-4bff-ab3c-d987d1f92da3	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N	4.2	INTERNAL	\N	2025-07-03 08:09:04.445	2025-07-03 08:09:04.445	REVENUE	COMPLETED	\N	\N	\N	\N
7d91eba1-d026-4c20-a248-fd750a97528a	0d9f1bb4-cc2e-4bff-ab3c-d987d1f92da3	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	\N	16.8	INTERNAL	\N	2025-07-03 08:09:04.447	2025-07-03 08:09:04.447	REVENUE	COMPLETED	\N	\N	\N	\N
47bf1917-9d11-4bad-ad12-8ded16ac18e8	ae6aabe2-2514-4503-86b5-97b6c9dc2e72	7858f458-beea-4d68-b101-4f72e865ce85	\N	21	WALLET	\N	2025-07-03 08:15:20.072	2025-07-03 08:15:20.072	PURCHASE	COMPLETED	\N	\N	\N	\N
dbf76ee4-d526-4504-9afd-aa3da8e4be48	92116ada-7bd0-4e95-862a-da70e8ebda54	7858f458-beea-4d68-b101-4f72e865ce85	\N	21	STRIPE	\N	2025-07-03 08:20:10.036	2025-07-03 08:20:10.036	PURCHASE	PENDING	\N	\N	\N	STRIPE
9efac0bf-3fa6-4c8e-b3ae-1726d8122ef3	a8fcc6f8-f4fc-4c67-9382-9d624e167529	2ee05674-9115-4f2a-a372-cd7bc4654241	\N	39.99	STRIPE	\N	2025-07-05 11:17:33.127	2025-07-05 11:17:52.189	PURCHASE	COMPLETED	\N	\N	\N	STRIPE
63e7def5-591f-4e4b-bf41-d7118eed4f49	a8fcc6f8-f4fc-4c67-9382-9d624e167529	e50b51b8-92d1-4c95-886d-dae6766fe13f	\N	7.998000000000001	INTERNAL	\N	2025-07-05 11:17:52.41	2025-07-05 11:17:52.41	REVENUE	COMPLETED	\N	\N	\N	\N
da09e971-cafc-4ac2-99de-13f92a0e519a	a8fcc6f8-f4fc-4c67-9382-9d624e167529	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	\N	31.992	INTERNAL	\N	2025-07-05 11:17:52.458	2025-07-05 11:17:52.458	REVENUE	COMPLETED	\N	\N	\N	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, "googleId", avatar, role, "authProvider", "isVerified", "deletedAt", "createdAt", "updatedAt", "facebookId") FROM stdin;
e50b51b8-92d1-4c95-886d-dae6766fe13f	Admin	admin@gmail.com	$2b$10$1V2WCX21vQaMtTz9GEW4g.PrgLNExadkV2iWl8jaMFcZdx.Ufax0S	\N		ADMIN	EMAIL_PASSWORD	t	\N	2025-05-17 04:21:25.434	2025-06-05 04:47:17.194	\N
2ee05674-9115-4f2a-a372-cd7bc4654241	sample 	sample@gmail.com	$2b$10$AEgaVU01W.nmyDvjW175g.GhzULlhJctdv7mY4Ldxk0po0ooGAmxu	\N	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1750912853294-360_F_619264680_x2PBdGLF54sFe7kTBtAvZnPyXgvaRw0Y.jpg	USER	EMAIL_PASSWORD	t	\N	2025-06-16 04:39:33.062	2025-07-06 08:45:04.261	\N
7858f458-beea-4d68-b101-4f72e865ce85	Faseela OP	faseelaop@gmail.com	$2b$10$r/FWsVjUCzbdtGfw7daaj.IlUZYo5Nt1lwR8mTEBS0/G2Tu6hla/e	\N	https://by-way-uploads.s3.ap-south-1.amazonaws.com/uploads/1751812296128-wes-hicks-4-EeTnaC1S4-unsplash.jpg	USER	EMAIL_PASSWORD	t	\N	2025-06-02 13:59:50.139	2025-07-06 14:31:38.372	\N
529574a3-4655-4260-894b-686e7f23fd8a	Rashin KP	rashinkpofficial@gmail.com	$2b$10$/xhzaX2h9Ijmqt3hNH8R9eVdIEpLBfjjAwivs7weRlBsPm4C691a6	\N	\N	USER	EMAIL_PASSWORD	t	\N	2025-07-07 03:58:29.186	2025-07-07 04:19:10.821	\N
c3c68d1f-813c-433c-ac8d-7cdb41c4099d	Rashin Kp	rashinkp001@gmail.com	$2b$10$nXdyNXkV34x/Mvb.I0At2OP24neM.oh7AxgdxmApWhQaQXh1BfReG	116118161474937473360	https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1420542102629495&height=50&width=50&ext=1754379583&hash=AT_JER4584LPVAC6S5xAPtdz	INSTRUCTOR	FACEBOOK	t	\N	2025-06-02 12:59:14.718	2025-07-07 04:58:50.267	1420542102629495
\.


--
-- Data for Name: UserProfile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserProfile" (id, "userId", bio, education, skills, "phoneNumber", country, city, address, "dateOfBirth", gender, "createdAt", "updatedAt") FROM stdin;
995e71dc-2398-4455-a4b0-1e1d631a9dbb	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	This is my new bio	Computer Science Graduate	javascript, python, machine learning	9037210082	India	malappuram	Draul (h) malappuram	2025-06-01 00:00:00	MALE	2025-06-02 13:07:27.512	2025-06-05 03:47:45.379
86fe6b93-7343-48da-af03-a6ddb80dd719	e50b51b8-92d1-4c95-886d-dae6766fe13f			\N	9037210082				\N	\N	2025-06-05 04:47:17.195	2025-06-05 04:47:17.195
6466afe0-1f89-47bf-94bb-3a8918d6be42	2ee05674-9115-4f2a-a372-cd7bc4654241			\N	9037210082				\N	\N	2025-06-26 04:40:54.032	2025-06-26 04:40:54.032
1f7fbc47-5a76-4ce8-8d0a-f7337cd4ea22	7858f458-beea-4d68-b101-4f72e865ce85	again update one	Computer Science Graduate	javascript, python, machine learning	9037210082	India	malappuram	Draul (h) malappuram	2025-06-02 00:00:00	MALE	2025-06-04 10:13:21.245	2025-07-06 14:31:38.373
\.


--
-- Data for Name: Wallet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Wallet" (id, "userId", balance, "createdAt", "updatedAt") FROM stdin;
e7c66368-46de-4f84-a62a-3854b04538a0	2ee05674-9115-4f2a-a372-cd7bc4654241	0.000000000000000000000000000000	2025-06-16 04:40:21.397	2025-06-16 04:40:21.397
0225bfed-3a3f-45e3-b18a-b7dba277b697	7858f458-beea-4d68-b101-4f72e865ce85	2.020000000000000000000000000000	2025-06-04 17:01:44.833	2025-07-03 08:15:20.067
00707616-d380-4bb7-bd7f-6d7591bfe115	e50b51b8-92d1-4c95-886d-dae6766fe13f	306.386000000000000000000000000000	2025-06-05 04:40:36.205	2025-07-05 11:17:52.367
cecde358-b4e0-4693-86f0-39fe7bcc5c15	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	485.544000000000000000000000000000	2025-06-05 03:59:20.666	2025-07-05 11:17:52.384
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a510fcb0-9c09-4ffd-bc00-188708e5a870	ad58a84c5ecb5a36f82acc37f1da43e2909d52345e195cb72a5e25d8bda0bf24	2025-05-16 14:05:02.971583+05:30	20250512162754_make_wallet_optional	\N	\N	2025-05-16 14:05:02.967182+05:30	1
bc9c9e38-c750-4375-b24d-d33caac14071	b8021bf8af46334a1e5dfb86dbc36422ae583fa25071093a0ff8d2d1aeb359ca	2025-05-16 14:05:02.785635+05:30	20250402111212_init_user_table	\N	\N	2025-05-16 14:05:02.77919+05:30	1
8aea6738-fa5a-4f1e-bfdc-d24707be385e	fcd067882370abc8e4424acb4889b132596daf446ee7ffc53ea945e0cc2f94c7	2025-05-16 14:05:02.878886+05:30	20250425150511_add_lesson_status	\N	\N	2025-05-16 14:05:02.877213+05:30	1
d4933c80-f36c-4e21-a8f8-5ee441f40b0b	99d0dd362992658b5a5964c6c9c311f55c6fcca6146d0905494e2332f704fa68	2025-05-16 14:05:02.795374+05:30	20250406125910_role_changed_user	\N	\N	2025-05-16 14:05:02.786004+05:30	1
8bd47831-bcd8-4505-b216-631535dd9440	b7eff8c13ced33a1c8aad16a08c28cd4b61465a662f9305f50466bfa4be25091	2025-05-16 14:05:02.804237+05:30	20250406141407_instructor_details_table_added	\N	\N	2025-05-16 14:05:02.795972+05:30	1
4a66fde5-af3b-4113-8a97-1b022f927c26	02e122e76f019a94ddb0d7e31f0bcd68e0722e2d4e650247149545a3ace227e6	2025-05-16 14:05:02.910239+05:30	20250506153250_cart_table_added	\N	\N	2025-05-16 14:05:02.900454+05:30	1
23c60c96-26b9-43ed-8166-3f31100f040e	53ac46fd8e66b4f3fde300bcde0c3131b07c92639be2d874bfa32c8f7c8f2007	2025-05-16 14:05:02.812415+05:30	20250408102418_add_user_profile	\N	\N	2025-05-16 14:05:02.804847+05:30	1
288ad964-f22d-430a-a2a7-c18927888d2e	172eb70c0f7a37e40c5567043d2cabc6f6c6148598000943ac54955f6450a0ef	2025-05-16 14:05:02.88062+05:30	20250426081303_removed_thumbnail_from_lesson	\N	\N	2025-05-16 14:05:02.879262+05:30	1
dead21a7-271b-4888-819c-5bf8a19c933d	b3db24ecc0355bb6988d1e04a250c16c0f4a90bf2c4629e940dfca4119ca9c01	2025-05-16 14:05:02.81438+05:30	20250408110207_add_user_profile	\N	\N	2025-05-16 14:05:02.812792+05:30	1
60c5ab60-db10-45d2-be83-1d01c6e7cb32	20d0261e8659189f37fd080d1027ebc076950cff612c360e1a0043313835f7be	2025-05-16 14:05:02.820325+05:30	20250409055712_added_user_verificaion_model	\N	\N	2025-05-16 14:05:02.814846+05:30	1
72c11050-02da-4daf-be8c-042a7880f047	581a062fe06afec8b4ac412469538a5d0218a664520a5daf056bace2bd934857	2025-05-16 14:05:02.827919+05:30	20250411055135_added_category	\N	\N	2025-05-16 14:05:02.820685+05:30	1
d67afab5-53db-4865-b089-f2929bf51e68	8056fcbd3cac5225de384a2177e598130f061786a8b11f29c185cca25846825a	2025-05-16 14:05:02.883412+05:30	20250427090454_update_lesson_content	\N	\N	2025-05-16 14:05:02.880979+05:30	1
1e76c0e5-52e2-4b7d-8901-553db26ecfcf	18e3a614c52dbde208cace8d066fa366c66d48284721bd0a7acbdeae6eb2b0b8	2025-05-16 14:05:02.82993+05:30	20250411063344_add_category_deleted_at	\N	\N	2025-05-16 14:05:02.828367+05:30	1
2964eb04-6510-4d83-9b4f-8a5b69a6e82f	ed4395d7c919693b5c975619daeba238e2a3a5017d2df0300319a5c7e10cd0ed	2025-05-16 14:05:02.842032+05:30	20250411162459_category_added	\N	\N	2025-05-16 14:05:02.830378+05:30	1
051f15da-0266-465c-bb90-34a8c1dec269	d44529380462b3b97412422a90e09949fb16d6c0f2f96668add0146878578b87	2025-05-16 14:05:02.859941+05:30	20250412050646_add_course_progress	\N	\N	2025-05-16 14:05:02.842444+05:30	1
794fdb4a-5192-4e37-8628-b5f1bf4d3f7c	0017eed01cbaf7ac27c818fe3c0a32744a578aef4b3f72e227c1221dfe40f9b7	2025-05-16 14:05:02.886211+05:30	20250427135130_updated_lesson_content_thumbnail	\N	\N	2025-05-16 14:05:02.883852+05:30	1
e19f4412-e0b2-471e-9464-4aa588f43122	3e427e9bf44e5e7467c0bfb217d51020d890bb48edeabe32450320d97c4233a9	2025-05-16 14:05:02.866837+05:30	20250412114806_course_content_added	\N	\N	2025-05-16 14:05:02.860477+05:30	1
0d8fb65c-07c1-428d-8411-1a43ba41bf13	4c85c3d8427a27000e8ef2d085543b0cb1e1abe1c1f86eb3ff4e05d3fd031e33	2025-05-16 14:05:02.874611+05:30	20250421155442_rename_instructor_to_createdby	\N	\N	2025-05-16 14:05:02.867269+05:30	1
e953e19b-81b2-4fe4-8e53-be3b313d4571	499d7c37970ddb28ece6ccfce2655dc72b2ca1b636006b9b9602ebbc231814f6	2025-05-16 14:05:02.93627+05:30	20250508053923_added_payment_tables	\N	\N	2025-05-16 14:05:02.910664+05:30	1
c3310e64-0f56-4d40-ba89-14cce59ec14a	0bb21c35e16ef6617c325dca3c3c7d5783ba89449c9abf186d9aba9711db35f5	2025-05-16 14:05:02.876752+05:30	20250421160642_revert_duration_to_int	\N	\N	2025-05-16 14:05:02.874976+05:30	1
70aca04f-5d80-4dde-b827-e5a78f4e5cd6	5fd9e16d0f94934968507f305f2ab75440146738cfb0939ad539c0f2c1bc8668	2025-05-16 14:05:02.892225+05:30	20250428043923_updated_lesson_resource	\N	\N	2025-05-16 14:05:02.886765+05:30	1
f31e1e14-9c9b-4838-986b-24e26d576483	911bc94f66151c81fd5d8ccc0f4ba1634811c449d78cc528e2483c38cd8914f4	2025-05-16 14:05:02.89527+05:30	20250428153435_lesson_delete_cascade	\N	\N	2025-05-16 14:05:02.892635+05:30	1
873a6ff2-8c5b-46cb-88ee-c9725caf6fb7	294801c0d6a06f6d30bdbf428c3f3494b369c989a760eedd0553ecbd591016aa	2025-05-27 13:42:21.714133+05:30	20250527081059_instructor_db_changed	\N	\N	2025-05-27 13:42:21.708153+05:30	1
6965c4f2-30a5-4a6d-a1f9-30e7e0937c7f	a895041ea0a5475e64bd389167057f3617225509d27a1ecc54f0365657477106	2025-05-16 14:05:02.897925+05:30	20250430043313_facebookid_added	\N	\N	2025-05-16 14:05:02.895628+05:30	1
f95822fb-e9a5-4d9f-a911-cce948edcdf8	b101c1da727996d7c9dc447e8915033462de5fcbe5dbde3194e148f6423e0835	2025-05-16 14:05:02.957137+05:30	20250508082117_modified_payment_tables	\N	\N	2025-05-16 14:05:02.936832+05:30	1
86e85f5f-4860-4f70-9625-64c29c4f58cd	8d4b5a398e034692a16e2c8f1e2a36e1b6777c8f32e521e5cdfee9c96fbff4c1	2025-05-16 14:05:02.900004+05:30	20250430043803_facebook_added_enum	\N	\N	2025-05-16 14:05:02.898424+05:30	1
838943f2-3b58-4a9d-8fa3-f199497b3d85	03ce025e97b08b0b2134ea4ea712ec6b4622e7e6aa3688db0ec8bcf50d88d13e	2025-05-16 14:05:02.973627+05:30	20250513144839_instructor_status_added	\N	\N	2025-05-16 14:05:02.971991+05:30	1
d4ba630b-d297-4b07-a6ef-d6cb55724e57	5758e5d090098aee988d28d03371f293990861f15f80b0065537752c4635b0b4	2025-05-16 14:05:02.958968+05:30	20250511083524_description_added_courseitem	\N	\N	2025-05-16 14:05:02.957535+05:30	1
c3e96a5f-f863-4e73-86a0-05f9ba17704d	0e8fc0d3bddfe00b1938c4f76f4818c319c5e1557a6d9dcbdfa140a6effad6f3	2025-05-16 14:05:02.966676+05:30	20250512144347_wallet_added	\N	\N	2025-05-16 14:05:02.959331+05:30	1
5dda7ec2-59cf-43e1-a6f8-66d25485e34f	f8db4cb3ef9fd75802e9248fc0257383702916e997cf89d5ff6345f7e58ea14d	2025-05-16 14:05:02.988527+05:30	20250515130200_role_change	\N	\N	2025-05-16 14:05:02.978499+05:30	1
c9a14ce5-5ecc-40e6-b16b-187c52b61240	6ca19f664c18f3cc91cac8c96a3fd5558ea8ec9cb4bb83d171132a9664428275	2025-05-16 14:05:02.975968+05:30	20250513184549_course_status	\N	\N	2025-05-16 14:05:02.973969+05:30	1
e608bec2-0275-4fdc-b70b-4005adb7cfec	f0aadc252ad75b3c47f0345af8c37e0979c98a3ddd40fe229184f63408244aaf	2025-05-16 14:05:02.978107+05:30	20250513190935_course_updated	\N	\N	2025-05-16 14:05:02.976328+05:30	1
45f0ce9e-ae8a-4227-b359-954d2bdf60f1	d55f07da62cc7309c2b9661354e2916e1f78ed3567576344c52481f64b89c55a	2025-05-16 14:05:02.998331+05:30	20250516083434_role_name_changed	\N	\N	2025-05-16 14:05:02.988935+05:30	1
9f439a2e-b22b-4055-87ea-a6a97b288bd6	a8abd18179ee242ba9693d5ec31cdb5d9dc3774eec110deb95d9c0b47e7ace21	2025-06-02 20:25:25.202684+05:30	20250602145524_add_lesson_progress	\N	\N	2025-06-02 20:25:25.170637+05:30	1
a2e2e2fb-7c3d-4931-bf08-ba6e534d416a	4645e8c9f8d82c81b6e3bc2267190fa5d5f4102af43d45fcff7d5b6bd8453e19	2025-06-01 15:09:32.559461+05:30	20250601093931_update_progress_tracking	\N	\N	2025-06-01 15:09:32.544057+05:30	1
1ac7f9be-7658-4ff2-a5e1-009f978d9942	d1a856e052109eb99b242c3cd0fc4ab7010ec007893fdb39338d32952b2a8050	2025-06-02 21:08:06.08134+05:30	20250602153805_remove_enrollment_progress_fields	\N	\N	2025-06-02 21:08:06.072926+05:30	1
797cd1fd-a0b1-451e-a299-e99700ddff1e	5a879bb449ed6cd58114f390e90b1fa65cf961575a3ac4157a4964d4b11283ed	2025-06-03 12:37:44.474662+05:30	20250603070743_add_quiz_fields_and_relations	\N	\N	2025-06-03 12:37:44.445885+05:30	1
7606f1f3-041d-4886-8c2e-426d213a82de	b2964f50aea0baf4a89ba27011a264c9dee570a39a3289224f549af0ac29f355	2025-06-04 22:48:46.787575+05:30	20250604171845_add_wallet_transaction_types	\N	\N	2025-06-04 22:48:46.77953+05:30	1
bccd9e5c-bf9e-48d4-80cc-40ef4a2b21d9	2cfb5c8e858b0b837561c464fa861039334a7b92dc3af09537f305220d0f1368	2025-06-04 23:06:31.713808+05:30	20250604173630_make_order_id_optional	\N	\N	2025-06-04 23:06:31.705851+05:30	1
61c23d83-02b1-495c-b891-8467f8f5645c	98a27659f61f7cfbb4378d8b8d25e818acca504f6803fb145d3065d062d9235c	2025-06-04 23:41:14.293319+05:30	20250604181112_add_wallet_payment_gateway	\N	\N	2025-06-04 23:41:14.285458+05:30	1
a9dfc1d7-99ab-4c58-8fc1-a61d11b664f8	20aba5ceadccd1b63f16f831c74212c433b1f829fa731031efa81ae8472ce42a	2025-06-05 10:38:09.220637+05:30	20250605050808_add_admin_share_percentage	\N	\N	2025-06-05 10:38:09.215193+05:30	1
bafdaf00-b3c1-4330-bdc4-bfe4efafdcde	f6153904471f6a9eb0386a78506c9c829261c8b88987be0da6c7134a8e164e08	2025-06-06 15:30:35.407349+05:30	20250606100033_add_admin_share_percentage_to_order_item	\N	\N	2025-06-06 15:30:35.383409+05:30	1
d1662027-4371-4f3c-a2ed-df4342e2b4c0	5038af781b2f7279ce55a1d8e9f01b0e67d957cb5dcfcc4ddf759d5e917810de	2025-06-20 04:13:48.383622+05:30	20250619224343_add_new_message_notification_type	\N	\N	2025-06-20 04:13:48.378139+05:30	1
12a526c9-9c90-4e53-a8f1-9bb35dca1a1a	bb1cc261ba65230e9be25d9e57898f562f256f4f6ef3a210e4cdc75b8842e0b9	2025-06-10 17:02:42.594272+05:30	20250610113241_add_payment_method_field	\N	\N	2025-06-10 17:02:42.553861+05:30	1
b9d50bc5-66fc-462f-b235-553e2d815e1c	3dcdcef3a0d379362e8b0e444cb2bebbc213f7ac3190439e1a20770196969952	2025-06-10 17:05:33.419889+05:30	20250610113530_make_order_id_optional_in_transactions	\N	\N	2025-06-10 17:05:33.372033+05:30	1
27b77287-3a48-4fec-87e9-676eae6c2d9a	ff5fd6108d047e754c27115aa966b386069f100d0948e0c5c07e4e8d0dcce3f8	2025-06-10 19:25:05.659861+05:30	20250610135505_add_failed_to_order_status	\N	\N	2025-06-10 19:25:05.655839+05:30	1
e810d961-1d9c-48e7-9997-521b25584f35	836fc3391e513dcb22fd7e9aeb5f2db3fc5a85bef78946158fc4b871599ff0f0	2025-06-20 04:47:02.960717+05:30	20250619231701_add_instructor_and_user_notification_types	\N	\N	2025-06-20 04:47:02.950227+05:30	1
13a311ea-a01a-4809-9d45-3aa3886b1961	9166facf75d5c56a7da94e096606d825dc316534924ef09479d8ec363edc7e48	2025-06-11 15:25:58.234543+05:30	20250611095556_add_internal_payment_gateway_and_transaction_types	\N	\N	2025-06-11 15:25:58.209085+05:30	1
66e78932-7789-4f66-a1a2-9b07c6ee0b56	77894f884c34a7dd0f9a7a589f114bbcb3cafa5b73e9ebf1cc45facab93671df	2025-06-17 15:26:50.108419+05:30	20250617095649_course_reveiw	\N	\N	2025-06-17 15:26:50.072216+05:30	1
c17e7bb4-606f-43ba-95cb-7e038b5251bf	2106ebcab42e686a0ae0a48ad7336e8774a898fa53fbd61a51fd7851688ea058	2025-06-18 14:08:32.47698+05:30	20250618083831_add_one_to_one_chat	\N	\N	2025-06-18 14:08:32.43809+05:30	1
2ab6f6a2-d814-43e9-9075-b5ceb3c9a391	3db68822a3a506d8c1747ba743fd996938f214307f6020f070dd529a7fe99a1a	2025-06-20 05:27:47.556577+05:30	20250619235746_add_certificate	\N	\N	2025-06-20 05:27:47.476866+05:30	1
beefa380-f611-4219-ab7b-80bf50ed2953	c93840ddb9dedddc39dc3bea00c48677f3a02b9848870d376cebbb976041810b	2025-06-19 23:43:45.601736+05:30	20250619181344_add_notification_model	\N	\N	2025-06-19 23:43:45.578322+05:30	1
d673437c-7e87-4ca3-b3c3-d6c0f3d4c4e2	d2223a422170ddfa1edfe08d11543a0aec31896bf17236ef39afed590554253f	2025-06-20 02:04:37.377691+05:30	20250619203435_add_course_approval_decline_notification_types	\N	\N	2025-06-20 02:04:37.37091+05:30	1
45d7a80f-66f1-4abe-a468-c9cfa0a9f3fd	8b49a0de3820e32e3a259efb2df31171e4a3491ca939dce09e0fa0420d9f8d95	2025-06-20 03:30:28.141704+05:30	20250619220026_add_course_enable_disable_notification_types	\N	\N	2025-06-20 03:30:28.133814+05:30	1
31208676-b2fd-4910-a970-0a2925598e0b	cccf889a528ca5ade8276fc1601104ccf58e108c991081a50328fa505fea85ef	2025-06-27 10:56:17.662398+05:30	20250627052616_add_media_and_read_status	\N	\N	2025-06-27 10:56:17.654097+05:30	1
1954ee96-594d-411e-b1dd-b9efc6190262	7f78fc2e3f8180dc3af32337bb2e48b5b5f550fa047f51f069029c5105574450	2025-06-20 03:43:53.208329+05:30	20250619221352_add_course_purchase_revenue_notification_types	\N	\N	2025-06-20 03:43:53.204989+05:30	1
01e36058-c0ce-4e43-86eb-69e4f33f65c5	b871b0f76c3f9e013f8308152e93a718130662fd8a06303cd3772ee7e072a18a	2025-06-27 10:57:14.157906+05:30	20250627052713_add_media_and_read_status	\N	\N	2025-06-27 10:57:14.150236+05:30	1
\.


--
-- Data for Name: user_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_verifications (id, user_id, email, otp_code, expires_at, attempt_count, is_used, created_at) FROM stdin;
94b192ab-94c2-4bdb-a2da-67bfaeeda231	2ee05674-9115-4f2a-a372-cd7bc4654241	sample@gmail.com	385318	2025-06-16 04:49:33.079	0	t	2025-06-16 04:39:33.079
0fec8602-d0d1-4541-acdc-1abb184e66af	c3c68d1f-813c-433c-ac8d-7cdb41c4099d	rashinkp001@gmail.com	139183	2025-07-07 05:08:08.722	0	t	2025-07-07 04:58:08.722
5c9dce67-5a98-4af2-b798-05e5971ee1d4	7858f458-beea-4d68-b101-4f72e865ce85	faseelaop@gmail.com	262880	2025-06-26 07:14:56.972	0	t	2025-06-26 07:04:56.972
a9d08fe8-c5e1-4d20-a98a-344b4f21c908	529574a3-4655-4260-894b-686e7f23fd8a	rashinkpofficial@gmail.com	667025	2025-07-07 05:53:28.353	2	t	2025-07-07 05:43:28.353
\.


--
-- Name: Cart Cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: Certificate Certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY (id);


--
-- Name: Chat Chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_pkey" PRIMARY KEY (id);


--
-- Name: CourseDetails CourseDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseDetails"
    ADD CONSTRAINT "CourseDetails_pkey" PRIMARY KEY (id);


--
-- Name: CourseReview CourseReview_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseReview"
    ADD CONSTRAINT "CourseReview_pkey" PRIMARY KEY (id);


--
-- Name: Course Course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_pkey" PRIMARY KEY (id);


--
-- Name: Enrollment Enrollment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("userId", "courseId");


--
-- Name: InstructorDetails InstructorDetails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InstructorDetails"
    ADD CONSTRAINT "InstructorDetails_pkey" PRIMARY KEY (id);


--
-- Name: LessonContent LessonContent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonContent"
    ADD CONSTRAINT "LessonContent_pkey" PRIMARY KEY (id);


--
-- Name: LessonProgress LessonProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonProgress"
    ADD CONSTRAINT "LessonProgress_pkey" PRIMARY KEY (id);


--
-- Name: Lesson Lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: QuizAnswer QuizAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_pkey" PRIMARY KEY (id);


--
-- Name: QuizQuestion QuizQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY (id);


--
-- Name: Refund Refund_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_pkey" PRIMARY KEY (id);


--
-- Name: TransactionHistory TransactionHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionHistory"
    ADD CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY (id);


--
-- Name: UserProfile UserProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Wallet Wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: user_verifications user_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_verifications
    ADD CONSTRAINT user_verifications_pkey PRIMARY KEY (id);


--
-- Name: Cart_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cart_courseId_idx" ON public."Cart" USING btree ("courseId");


--
-- Name: Cart_userId_courseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Cart_userId_courseId_key" ON public."Cart" USING btree ("userId", "courseId");


--
-- Name: Cart_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Cart_userId_idx" ON public."Cart" USING btree ("userId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: Certificate_certificateNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Certificate_certificateNumber_idx" ON public."Certificate" USING btree ("certificateNumber");


--
-- Name: Certificate_certificateNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON public."Certificate" USING btree ("certificateNumber");


--
-- Name: Certificate_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Certificate_courseId_idx" ON public."Certificate" USING btree ("courseId");


--
-- Name: Certificate_issuedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Certificate_issuedAt_idx" ON public."Certificate" USING btree ("issuedAt");


--
-- Name: Certificate_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Certificate_status_idx" ON public."Certificate" USING btree (status);


--
-- Name: Certificate_userId_courseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Certificate_userId_courseId_key" ON public."Certificate" USING btree ("userId", "courseId");


--
-- Name: Certificate_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Certificate_userId_idx" ON public."Certificate" USING btree ("userId");


--
-- Name: Chat_user1Id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Chat_user1Id_idx" ON public."Chat" USING btree ("user1Id");


--
-- Name: Chat_user1Id_user2Id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Chat_user1Id_user2Id_key" ON public."Chat" USING btree ("user1Id", "user2Id");


--
-- Name: Chat_user2Id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Chat_user2Id_idx" ON public."Chat" USING btree ("user2Id");


--
-- Name: CourseDetails_courseId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CourseDetails_courseId_key" ON public."CourseDetails" USING btree ("courseId");


--
-- Name: CourseReview_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseReview_courseId_idx" ON public."CourseReview" USING btree ("courseId");


--
-- Name: CourseReview_courseId_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CourseReview_courseId_userId_key" ON public."CourseReview" USING btree ("courseId", "userId");


--
-- Name: CourseReview_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseReview_createdAt_idx" ON public."CourseReview" USING btree ("createdAt");


--
-- Name: CourseReview_rating_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseReview_rating_idx" ON public."CourseReview" USING btree (rating);


--
-- Name: CourseReview_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CourseReview_userId_idx" ON public."CourseReview" USING btree ("userId");


--
-- Name: Enrollment_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Enrollment_courseId_idx" ON public."Enrollment" USING btree ("courseId");


--
-- Name: Enrollment_orderItemId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Enrollment_orderItemId_key" ON public."Enrollment" USING btree ("orderItemId");


--
-- Name: Enrollment_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Enrollment_userId_idx" ON public."Enrollment" USING btree ("userId");


--
-- Name: InstructorDetails_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "InstructorDetails_userId_key" ON public."InstructorDetails" USING btree ("userId");


--
-- Name: LessonContent_lessonId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LessonContent_lessonId_key" ON public."LessonContent" USING btree ("lessonId");


--
-- Name: LessonProgress_enrollmentId_courseId_lessonId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "LessonProgress_enrollmentId_courseId_lessonId_key" ON public."LessonProgress" USING btree ("enrollmentId", "courseId", "lessonId");


--
-- Name: Lesson_courseId_order_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Lesson_courseId_order_key" ON public."Lesson" USING btree ("courseId", "order");


--
-- Name: Lesson_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Lesson_order_idx" ON public."Lesson" USING btree ("order");


--
-- Name: Message_chatId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_chatId_idx" ON public."Message" USING btree ("chatId");


--
-- Name: Message_senderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Message_senderId_idx" ON public."Message" USING btree ("senderId");


--
-- Name: OrderItem_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderItem_courseId_idx" ON public."OrderItem" USING btree ("courseId");


--
-- Name: OrderItem_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OrderItem_orderId_idx" ON public."OrderItem" USING btree ("orderId");


--
-- Name: Order_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Order_userId_idx" ON public."Order" USING btree ("userId");


--
-- Name: QuizAnswer_lessonProgressId_quizQuestionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "QuizAnswer_lessonProgressId_quizQuestionId_key" ON public."QuizAnswer" USING btree ("lessonProgressId", "quizQuestionId");


--
-- Name: Refund_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Refund_courseId_idx" ON public."Refund" USING btree ("courseId");


--
-- Name: Refund_orderItemId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Refund_orderItemId_idx" ON public."Refund" USING btree ("orderItemId");


--
-- Name: Refund_orderItemId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Refund_orderItemId_key" ON public."Refund" USING btree ("orderItemId");


--
-- Name: Refund_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Refund_userId_idx" ON public."Refund" USING btree ("userId");


--
-- Name: TransactionHistory_courseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TransactionHistory_courseId_idx" ON public."TransactionHistory" USING btree ("courseId");


--
-- Name: TransactionHistory_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TransactionHistory_createdAt_idx" ON public."TransactionHistory" USING btree ("createdAt");


--
-- Name: TransactionHistory_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TransactionHistory_orderId_idx" ON public."TransactionHistory" USING btree ("orderId");


--
-- Name: TransactionHistory_paymentGateway_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TransactionHistory_paymentGateway_idx" ON public."TransactionHistory" USING btree ("paymentGateway");


--
-- Name: TransactionHistory_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TransactionHistory_status_idx" ON public."TransactionHistory" USING btree (status);


--
-- Name: TransactionHistory_transactionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "TransactionHistory_transactionId_key" ON public."TransactionHistory" USING btree ("transactionId");


--
-- Name: TransactionHistory_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TransactionHistory_type_idx" ON public."TransactionHistory" USING btree (type);


--
-- Name: TransactionHistory_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TransactionHistory_userId_idx" ON public."TransactionHistory" USING btree ("userId");


--
-- Name: TransactionHistory_walletId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "TransactionHistory_walletId_idx" ON public."TransactionHistory" USING btree ("walletId");


--
-- Name: UserProfile_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "UserProfile_userId_key" ON public."UserProfile" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_facebookId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_facebookId_key" ON public."User" USING btree ("facebookId");


--
-- Name: User_googleId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_googleId_key" ON public."User" USING btree ("googleId");


--
-- Name: Wallet_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Wallet_userId_idx" ON public."Wallet" USING btree ("userId");


--
-- Name: Wallet_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Wallet_userId_key" ON public."Wallet" USING btree ("userId");


--
-- Name: user_verifications_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_verifications_email_key ON public.user_verifications USING btree (email);


--
-- Name: Cart Cart_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Cart Cart_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Cart"
    ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Category Category_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Certificate Certificate_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Certificate Certificate_enrollmentId_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_enrollmentId_courseId_fkey" FOREIGN KEY ("enrollmentId", "courseId") REFERENCES public."Enrollment"("userId", "courseId") ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Certificate Certificate_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Chat Chat_user1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Chat Chat_user2Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Chat"
    ADD CONSTRAINT "Chat_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourseDetails CourseDetails_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseDetails"
    ADD CONSTRAINT "CourseDetails_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourseReview CourseReview_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseReview"
    ADD CONSTRAINT "CourseReview_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CourseReview CourseReview_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CourseReview"
    ADD CONSTRAINT "CourseReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Course Course_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Course Course_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Course"
    ADD CONSTRAINT "Course_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Enrollment Enrollment_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Enrollment Enrollment_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public."OrderItem"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Enrollment Enrollment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Enrollment"
    ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InstructorDetails InstructorDetails_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InstructorDetails"
    ADD CONSTRAINT "InstructorDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LessonContent LessonContent_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonContent"
    ADD CONSTRAINT "LessonContent_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LessonProgress LessonProgress_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonProgress"
    ADD CONSTRAINT "LessonProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LessonProgress LessonProgress_enrollmentId_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonProgress"
    ADD CONSTRAINT "LessonProgress_enrollmentId_courseId_fkey" FOREIGN KEY ("enrollmentId", "courseId") REFERENCES public."Enrollment"("userId", "courseId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LessonProgress LessonProgress_lessonId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."LessonProgress"
    ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES public."Lesson"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lesson Lesson_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lesson"
    ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_chatId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES public."Chat"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuizAnswer QuizAnswer_lessonProgressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_lessonProgressId_fkey" FOREIGN KEY ("lessonProgressId") REFERENCES public."LessonProgress"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuizAnswer QuizAnswer_quizQuestionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizAnswer"
    ADD CONSTRAINT "QuizAnswer_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES public."QuizQuestion"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuizQuestion QuizQuestion_lessonContentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuizQuestion"
    ADD CONSTRAINT "QuizQuestion_lessonContentId_fkey" FOREIGN KEY ("lessonContentId") REFERENCES public."LessonContent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Refund Refund_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Refund Refund_orderItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES public."OrderItem"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Refund Refund_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Refund"
    ADD CONSTRAINT "Refund_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TransactionHistory TransactionHistory_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionHistory"
    ADD CONSTRAINT "TransactionHistory_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public."Course"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TransactionHistory TransactionHistory_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionHistory"
    ADD CONSTRAINT "TransactionHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TransactionHistory TransactionHistory_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionHistory"
    ADD CONSTRAINT "TransactionHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TransactionHistory TransactionHistory_walletId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TransactionHistory"
    ADD CONSTRAINT "TransactionHistory_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES public."Wallet"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: UserProfile UserProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserProfile"
    ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Wallet Wallet_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_verifications user_verifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_verifications
    ADD CONSTRAINT user_verifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

