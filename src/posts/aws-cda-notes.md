---
path: "/aws-cda-exam"
date: "2020-09-16"
title: "AWS CDA Exam notes"
excerpt: "AWS CDA Exam Notes"
published: false
slug: "aws-cda-notes"
---

I'm currently studying for the AWS CDA exam, and these are my notes:

## Creating a Billing Alarm

When working with AWS as part of learning, we'd like to make sure we don't rack up a huge bill by accident.
We can create an alert within AWS that will notify us
when our bill is over a threshold. Here are the basic steps to do that:

- Create an AWS account, if you don't already have one.

- Now, let's create billing alarm, to make sure we don't rack up a huge bill by accident.
  Currently, AWS has an to provide you with free tier billing
  notifications by default. This might be sufficient for you if you know you will
  not exceed free tier limits. However, if you want to set a specific threshold
  for receiving notifications, we can set up a custom billing alarm.

- To do this, we're going to use the AWS service "CloudWatch". Log into
  the AWS console, then select the "CloudWatch" from the services list.

- Under "Alarms" select "Billing". Click "Create Alarm". Under "Metrics" select
  "Total Estimated Changes".

- Check the metric box and click "Select Metric".

- Under Conditions, select "Static" and then "Greater/Equal". For the threshold
  value, put \$1, or whatever amount you want to trigger a notification.

- Select "In alarm" for the trigger state.

- Create an SNS topic with any name you'd like.
  'My_CloudWatch_Billing_Alarms Topic". Click Next.
- Add a Name and Description for the Alarm, and click "Create Alarm".

#### A note about access to Billing information

By default, only the AWS account root user has access to billing information.
IAM users who have policies granting access to billing information will not
have access unless IAM user access is turned on at the account level. This can
be done by logging in as the root user -> account -> IAM User Role Access to
Billing Information.

### Understanding availability zones

- "Regions" are geographically separated locations throughout the world.
- "Availability Zones" or "AZ" exist within regions, and further separate data
  centers for fault tolerance.
- Applications typically exist in a single region, but across availability
  zones. For example, a VPC exists across multiple Availability Zones.
- Availability Zones are connected via low-latency connections.
- Most configuration within AWS is at the "Region" level, there are fewer ways
  to control availability zones.
- Some AWS services, like IAM, work globally. The region will show as "Global"
  in the console.

### Shared security responsibility

- AWS is responsible for keeping the physical hardware secure and running
  smoothly
- We are responsbile for configuring our infrastructure on the AWS platform
  security, e.g. properly using IAM users secret rotation, patching AMI OS
  updates, etc.

### AWS Compute Overview

- There are four main services in the "Compute" category: EC2, ECS, Lambda,
  Elastic Beanstalk.
  - EC2 - virtual machines
  - ECS - containers
  - Lambda - serverless
  - Elastic Beanstalk - PaaS solution
- Each offers a different layer of control.

### AWS storage overview

- RDS (Managed SQL), DynamoDB (Serverless NoSQL), ElastiCache (In-Memory Cache
  Engine), RedShift (Data Warehousing)

## IAM

### IAM User basics

- Gives acccess to different AWS resources
- Applies globally to all AWS regions
- All new non-root IAM users have no access to anything by default (implicit deny)
- Delete root access keys, create an IAM user for yourself that has adminstrative
  permissions
- Add MFA for the root user. If you have MFA already turned on for your Amazon
  account (I used the same one I use for occasional shopping on Amazon.com)
  account MFA turned on, Adding MFA for root user will require you to enter a
  _second_ one-time password when you are logging into AWS console as the root
  user.
- Security best practice is to not use the root user for day-to-day
  activity. Add a IAM user for your personal day-to-day use
- Create an admin group, so we can assign permissions to your user
- IAM password policy - define the types of passwords IAM users
- On the IAM Dashboard, there's a link "Sign-in URL for IAM users in this
  account". Use this page to log in with day-to-day users.

### IAM Policies

- a document that specifies permissions
- Two main types: explicit allow, and explicit deny (which overrides allows)
- AWS provides some pre-written templates "managed policies', for example, an admin access policy
  that grants access to everything:

```json
{
  "Version": "2020-11-08",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}
```

- Policies take effect immediately
- Policies can be directly attached to a user, cannot be attached directly to
  AWS resources

- Policy creation - when creating a policy you need to indicate the resources
  that the policy can apply to. You are able to allow access to any resource
  (or any resource within the account), but best practice is to specify the
  specific resources that can be allowed.

### IAM Users

- IAM users start with an implicit deny for all services
- Access credentials are unique for each user (never share users)
- User credentials should not be stored or passed to an EC2 instance. (There's
  roles for that purpose).
- Users can have policies directly applied to them, or indirectly through being
  part of a group.
- Attached policies that have explicit deny will always override an explicit
  allow.
- Non-explicit denies are automatic (default for a user), Explicit denies are attached

### Groups

- To assign the same permissions to multiple users, typically attach policies to
  a group, and add multiple users to that group

### Roles

Some uses for roles

1. **Temporary access**: Attaching Policies gives a user 'permanent' permissions to
   perform an action. When an entity "assumes" a Role, the entity to
   temporarily gain a set of permissions defined by the role.
2. **Access for AWS resources or on-prem**: Polcies are not assignable to AWS resources themselves (like EC2) or non-AWS
   account holders. AWS allows you to assign roles directly to EC2 for
   specifying permissions for those machines. This allows you to avoid passing
   user credentials to EC2s.
3. **Across-account access.** Allowing a user to assume a role with permissions in
   another account

### Security Token Service

- Create temporary credentials, similar to the long-term credentials that users
  have.
- Not assigned to user (generated dynammically when needed).
- Expires after a short time, but users can request new credentials.
- **Advantages**
  - Don't need to embed long-term AWS security credentials in an application
  - Grant access to a resource without needing to specify an IAM identity
  - No rotation needed (temporary credentials)
- **When to use**

  - Cross-account access
  - Identify Federation - Give access to users outside of AWS (Enterprise
    Identity)
  - [roles for EC2 or other AWS resources](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_aws-services-that-work-with-iam.html)
  - asdf

- **STS API calls (could be on exam):**
  - `AssumeRole` - allow an IAM user to access Resources they normally
    have access to (e.g. another account, or privledged access)
  - `AssumeRoleWithWebIdentity` - temporary credentials for federated users
    authenticated through a public identity provider (e.g. Google, or another
    OpenID Connect identify provider)
  - `AssumeRoleWithSAML` - credentials for federated users authenticated by existing
    organisation's identity system that uses SAML.
  - `GetFederationToken` - used to get credentials if you have a custom
    identity broker (e.g. a proxy application that grants permissions), with a
    longer period of validity compared to to `AssumeRole`.
  - `GetSessionToken` - credentials for users in untrusted environments (e.g.
    mobile device or web browser)

### IAM API Keys

- Needed to access resources programmatically (CLI or SDK)
- Must be directly associated with a user
- Access Keys and Policy combined determine whether or not a programmatic user
  can access an AWS resource

### KMS

- encryption keys for encrypting data
- Customer Master Keys (CMK) are used to encrypt, decrypt, and generate "Data
  Keys", which in turn can be used to encrypt data
- Two types: customer managed and AWS-managed
- KMS does not manage your data keys (only CMKS), you need to manage that yourself.
- You store the encryped data key (with CMK) alongside encrypted data
- API Actions
  - `Encrypt` - encrypt plaintext using a CMK
  - `GenerateDataKey` - GenerateDataKey - use a CMK to return plaintext and
    ciphertext version of a data key
  - `Decrypt` - Decrypts ciphertext that was encrypted with Encrypt,
    GenerateDataKey

### Inspector

- Helps ensure my EC2 instances are secure
- Checks the network setup, checks the software on your EC2 for vulnerabilities

### Cognito

- User Pools - a directory of users
- Identity Pools - similar to IAM roles that can grant users access to AWS
  resources
- Allows you to manage unauthenticated users (e.g. users have already started
  using your app, but you want to allow them to sign up).

## EC2

### EC2 Overview

- Scalable virtual servers, which is an "instance"
- Configuration
  - AMI - Operating system and other settings
  - Instance Type: compute power, RAM, network bandwidth
  - Network Interface: public, private, or elastic IP
  - Storage
    - Elastic Block Storage - network persistent storage
    - Elastic File System - scalable file storage
    - Instance Store - ephemeral storage
- Security Group must be assigned to an EC2
- Each instance must be placed into an existing VPC, availability zone, and subnet
- bootstrapping allows you to run scripts on startup
- Can use Tags to name and organize instances
- Encrypted key pairs are used to manage login authentication
- limits to number of instances you can run in each region

#### EC2 - AMI (Amazon Machine Image)

- Preconfigured template required to launch an EC2 Instance
- Operating System
- Software packages
- Other required settings
- Auto scaling will use AMI's to start new instances
- Can create your own AMIs
- Marketplace has paid AMI's with some licensed software
- AMIs are only available in the region they are created.

#### EC2 Instance Types

- Compute power, memory, storage, network performance
- Current generation will be non-deprecated instance types
- Different families of instance types
  - General purpose (T2, M4/M5)
  - Compute Optimized (C4 and C5) - high performance web servers, science apps,
    ad serving
  - Memory Optimized (X1e, X1 and R4) - high
  - Accelerated Computing (P3, P2, G3, F1)
  - Storage Optimized (H1, I3, D2)

#### EC2 Purchasing Options

- **On Demand**
  - provision and terminate at any time.
  - billed while the instance is running.
  - Most expensive.
- **Reserved Instances**
  - purchase an intance for 1-3 years
  - fixed bill for the time period (not based on actual usage), at a discount compared to On Demand
  - Less flexible
  - AZ specific reserved instances will get guaranteed to have an available instance. Regional RI purchases are not guaranteed.
- **Spot Instance**
  - Bid on an instance price, and only use/pay when the variable spot price <= bid price
  - instances are provisioned and terminated automatically based on the spot price being <= you bid price
  - good to non-production appliations or applications where you want to control the cost
- **Dedicated Hosts**
  - If you need dedicated hardware

#### EC2 Instance Details

- All instances have a Private IP address
- Option to assign a public IP (e.g. you want to ssh into it, or have it serve
  web traffic)
- Elastic IP - static IPv4 address that can be attached to an instance (and
  remapped to another instance during instance failures

#### EC2 Storage

- **Elastic Block Storage**
  - **Overview**
    - Persistent, can last beyond the termination of the EC2 instance if needed
    - Network Attached Storage, can be attached to detached from various EC2 instances (one at a time)
    - Replicated with AZ
    - Normally mounted to /dev/sda1 or /dev/xvda
  - **EBS Performance**
    - Input/Output is measured in IOPS (256 kb chunks of input/output per second)
    - Type of EBS volume used will affect your IOPS perf
  - **EBS Initialization**
    - Volumes created from an EBS snapshot have a startup time and must be _initialized_
    - Initializing occurs the first time a storage block is read
    - Can reduce startup cost by manually reading storage blocks
  - **EBS Types**
    - General purpose SSD
    - Provisioned IOPS SSD
    - Cold HDD, Throughput optimized HDD
    - Magnetic (legacy, cheapest)
  - **EBS Snapshot backups**
    - Point in time backup in S3
    - Incremental in nature (stores differences in snapshots)
    - Can be used to fully restored EBS volumes
    - Frequent snapshots recommended, take during off-peak hours
- **Instance Store Volume**
  - Only available for certain instance types (e.g. i3.large)
  - virtual devices that run on the same hardware that is running the instance
  - ephemeral, but retrained for reboots
- **EBS vs. Instance Store**
  - EBS instances can be stopped and restarted without losing data
  - Instance-store uses ephemeral storage (which is retained during reboots)
- **Root volumes can be EBS or Instance Stores**
  - Previously, AMI's were all backed by Instance Stores, now we have the
    option for EBS backing the AMI's
- **Elastic File System (EFS)**
  - fully-managed
  - Scalable storage, EFS can scale to petabytes
  - Storage capacity automatically increases/decreases
  - Can be used by one or more EC2 instances at the same time
  - Can be used to migrate data from on-prem
  - Must be attached to EC2 _after_ instance creation
- **EC2 Key Pairs**
  - basically your ssh key
  - AWS stores the public key on the instance
  - Need to `chmod 400` the `.pem` file when using ssh

#### EC2 - Elastic Load Balancer

- distribute network traffic among multiple server instances (even across AZ)
- Can terminate SSL in a load balancer to reduce compute power of EC2
- **Sessions Management**
  - Load Balancer Generated Cookie Stickiness - LB issues a cookie, send user to specific instance
  - Application Generated Cookie Stickiness - LD uses app-generated cookie to
    associate session with instance
  - No Sticky Cookie (Recommended)
    - ELB distributes load equally to all instances
    - use ElastiCache or backing database for session
- **Types**
  - Classic Load Balancer - HTTP HTTPS, and TCP (use for EC2-Classic network)
  - Network Load Balancer (TCP) - Low-latency load balancer at the connection level
  - Application Load Balancer (HTTP/HTTPS) - routing, TLS termination, and visibility at request level

#### EC2 Shared Responsibility

- Customer is responsible for managing the software level security
  - Security Groups
  - Firewalls
  - EBS encryption
  - SSL Certificate to an ELB
- AWS is responsible for managing the hypervisor and physical security
  - DDOS protection
  - Port scanning protection
  - Ingress network filtering

#### EC2 API Actions

- `DescribeInstances` API action - describe EC2
- `DescribeImages` API action - describe AMI's
- `RegisterImage` API action - registers an AMI

#### Error Codes

- https://docs.aws.amazon.com/AWSEC2/latest/APIReference/errors-overview.html
- Client Errors - causes by a bad request 400 level, problem with you (the client)
- Server Errors - 500 error caused by an AWS server issue
- Review some the API actions

#### Lab - Set up a EC2 Workstation

### Virtual Private Cloud VPC

- **VPC Overview**
  - Interactions with other services Route 53, CloudFront, S3 for static storage
    is covered in the Solutions Architects Course
  - Private network, mimics Corporate on-prem network
  - Hosted in a specific AWS region, can span multiple AZ
  - Can pair two VPCs to 'connect' two AWS regions
  - AWS provides a DNS server for your VPC to each instance has a hostname (can
    run own DNS)
- **VPC Benefits**
  - Can use a subnet, define custom CIDR (IP range) inside each subnet
  - Ability to configure routes between subnets via route tables
  - Ability to configure internet gateway allow access to internet
  - layered networked
  - Ability to extend on-prem network into cloud with VPN
  - layered security
    - instance level Security Groups (firewall on the instance level)
    - Subnet level network ACLs (firewall on the subnet level)
- **Default VPC**
  - AWS accounts have a default VPC
  - Is the VPC that comes configured in your AWS account
  - Default allows easy-access to a VPC
  - All subnets have access to the broader internet through an attached internet gateway
  - Each EC2 instance will have a public and private IP (subnets setting)
  - technical details
    - size `/16` IPv4 CIDR Block (provides up to 65,536 private IPv4 addresse)
    - size `/20` default subnet in each Availability Zone
    - comes with an IGW attached to VPC
    - has a route entry in the main route table directing all traffic to the IGW
    - default security group
    - default NACL
    - communication is allowed between all subnets
- **VPC Limits**
  - can only have 5 VPC in a region
  - 5 internet gateways per region
  - 50 customer gateway per region
  - 50 VPN connections per region
  - 200 route tables per region / 50 entries per route table
  - 5 elastic IP addresses
  - 50 rules per security group
  - 5 security groups per network interface

### Networking Components

- **Internet Gateway (IGW)**

  - exposes VPC to the open internet
  - horizontally scaled, redundant, highly available, no bandwidth cost
  - provides NAT translation for instances that have a public IP

  - **IGW Rules**
    - Only 1 IGW can be attached to a VPC at a time
    - Cannot be detached from a VPC while there are active AWS resources

- **Route Table**

  - A set of rules for determining where traffic can go
  - Route table can connect a subnet to the Internet Gateway, or to other
    subnet

- **NACL**

  - Optional firewall in front of one or more subnets inside your VPC
  - Are **_stateless_** - Must specify rules for both inbound and outbound traffic
  - outbound SSH traffic uses an ephemeral port, which is selected in a
    particular range (e.g. TCP 1024 - 65535)
  - Default NACL is created for each subnet
  - Rules are applied based on the rule number, from lowest to highest. First
    matching rule found that applies to the traffic type is immediately applied
  - The last rule in every ACL is a "catch all" deny rule.
  - A subnet can only be associated with _one_ NACL at a time
  - All new NACL deny traffic by default, must explicitly allow traffic
  - NACL can deny or allow traffic to subnets. Once traffic is inside the
    subnet, other AWS resources can have additional layers of security (security groups)

- **Subnets**

  - Restrited to a single AZ
  - Subnet must be associated with a route table
  - A public subnet has a route table pointing to a IG, while a private subnet
    would point to a route table without an IG

- **Security Group**

  - Firewall at the EC2 instance level
  - Allow/Deny rules work a bit differently compared to NACL
  - Rules are _stateful_, and SC only support allow rules, so traffic is allowed in, it is
    also allowed out
  - All traffic is denied, unless you explicitly allow it
  - No execution order, all rules are evaluated for all traffic

- **Highly Available VPC architecture**

  - ELB Basics
    - EC2 service that automates the process of distributing traffic evenly
    - can route traffice to EC2 instances _across multiple availability zones_
  - Autoscaling
    - increases/decreases number of instances available
    - based on chosen _Cloudwatch_ metrics
    - elasticity refers to the ability to scale up and scale down

* **Working with a bastion host and NAT Gateway**
  - What if we want some instances not to be connected to the open internet,
    and only talk to machines within a private subnet, but we also want to be able to
    update the software on those machines?
  - **A Bastion host**
    - EC2 instance that lives inside a public subnet, "gateway" for traffic
      that is destined for instances that live inside private subnets
    - critical _strong point_, all traffic must pass through it first
    - should be hardened, with extra security and third party
      security/monitoring
    - Can be used as an access point to SSH into an internal network without
      needing a VPN
    - SSH into the Bastion host, then SSH from the bastion to the private instance
  - **NAT Gateway**
    - Designed to provide EC2 instances on a private
      subnet a route to the internet to allow software updates
    - prevents any hosts outside of the VPC from
      trying to initiate a request
      through the NAT into a private subnet
    - "one-way street": only allows incoming traffic if a request originated from inside of the
      private subnet
  - NAT Gateway Requirements
    - **_must be provisioned inside a public subnet_**
      (which in turn needs to
      be connected to the route table that is associated with an Internet
      Gateway)
    - **_must be part of the private subnet's route table_**
      - In the past, people used _NAT Instances_ - an EC2 instance that had software installed to act as a NAT Gateway
      - AWS has replaced this practice with fully managed service, the NAT Gateway

### Load Balancing Details

- Original (Classic) Load Balancer is **deprecated** and has been replaced by ALB and NLB
- **Application Load Balancer**
  - operates on Layer 7, the Application Layer, of the OSI
  - handles HTTP/HTTPS
  - **Benefits:**
    - makes routing decisions at the application layer, HTTP request level - supports _path-based_ routing (based on the URL)
    - _host-based_ routing
    - based on the host HTTP header
    - supports routing to multiple ports on a single EC2 instance (e.g. for containers)
    - SSL/TLS Termination, handles the decrypting of requests
- **Network Load Balancer**
  - operates on Layer 4 (Transport Layer) of the OSI
  - handls TCP and TLS
  - Can handle millions of requests per second
  - Forwards requests without modifying the headers
  - **Benefits:**
    - Supports static IP addresses, good for firewalls
    - Ultra-high performance (starts at layer 4)
    - ability to terminate TLS connections at scale
    - Allows end-to-end encryption, for applications that need higher security and require encryption in
      transit. If we used an ALB we would have to decrypt/encrypt twice. (decrypt HTTPS, inspect the headers, encrypt
      the message again and send to the webserver)
- When you create one (ALB or NLB)
  - you can add 'listeners' (what type of traffic and what port, e.g. HTTP/TCP on Port 80, HTTPS/TLS on Port 443)
  - Specify the AZ for which the Load Balancer will target, only one subnet per AZ
  - Security Groups - that corresponds to the Listener
  - routing: specify a target group, and the EC2 instances you want to
    include in the target group, and how to perform health checks
  - Both support dynamic ports (Classic does not)
    - With Docker containers, we want to be able to run mutliple application on the same EC2 Instance
    - Each container will have a randomly assigned port, which is dynamic
    - Dynamic ports are facilitated by target groups
    - Target group tracks the list of ports that are accepting traffic on each instance

### Lambda

- **Overview**

  - Serverless platform, only pay for the compute time
  - highly avaiable, fault tolerant, and elastic, cost efficient
  - Lambda function packages (code, dependencies)
  - Integrates well with other AWS services (e.g. API gateway, CloudWatch)
  - Multiple languages supported
  - Maxium runtime is 15 minutes (900 Seconds)

- **Use Cases:**

  - Any event-driven task

    - Data processing
    - Real time file processing (e.g. convert a high-def file to a lo-def)
    - Real time stream processing (e.g. process events from Kinesis)
    - ETL - Extract Transform Load operations
    - IoT Backends - Build serverless backends using AWS Lambda to handle web mobile, Internet of Things

  - Stream processing and ETL processes
  - IOT and mobile back ends
  - Web application APIs

- **Lambda Function configuration**

  - Language runtime
  - filename.function name format
  - Memory
  - Maximum execution length (timeout of function)
  - Permissions
    - (IAM roles grant the function permissions to interact with other AWS resources)
    - Resource-based policy allows other AWS resourcs to invoke your function on your behalf
  - Environment Variables
    - Don't hard code variables in your Lambda code
    - Dynamically set varibles for things like db database connection information
    - There are a number of Environment Variables that are set by default e.g. `AWS_LAMBDA_FUNCTION_VERSION`.
  - VPC to have access to
  - Dead Letter Queue
  - Concurrency
  - Tags

- **Lambda Versions and Aliases**

  - \$LATEST always points to the latest version, and is the only mutable version
  - A numbered version - not editable, immutable, have a specific ARN
  - Aliases - static ARN, but can point to any Lambda version, can be used to split traffic between two version
  - Benefits
    - Easier management of different stages of code developer
    - Avoid reconfiguration of event sources (they can point to a function alias)
    - Rollbacks easier by just changing alias
    - Split traffic so you can test two versions in production

- **Common API Actions**

  - `AddPermission` - adds permission to lambda to allow another resource to push
    events to the lambda. This is done automatically when adding a trigger through the UI.
  - `CreateFunction` - create a new lambda function
  - `Invoke` - invoke a function, with async or sync invocation type
  - `CreateEventSourceMapping` - allow a stream (Kinesis) as an event source for the function
    (subscribe the lambda to the stream events). Does not require setting up Resource-based policies

- **Function Packages**

  - e.g. update a zip package of the code and dependencies e.g. `node_modules`
    and any other javascript files that are needed for your lambda function

### Questions

1. > What AWS networking resources are required for an EC2 instance to have access
   > to the broader internet?

   _Needs to be configured by you:_

   - Create an EC2 in a subnet within a VPC
   - An Internet Gateway attached to the VPC
   - a Route Table associated wit the subnet that routes all outbound traffic to the Internet Gateway
   - EC2 instance must have public IP (assigned at creation) or attaching an elastic IP
   - Security Group on top of instance must allow inbound traffic `0.0.0.0/16`

   _Automatic (no configuration required):_

   - NACL - created automatically when you create a VPC, associated with a
     subnet, allows public network connectivity by default

1. > What are AWS edge locations?
   > Part of CloudFront's CDN network -located in many major cities - not located in a specific regions

1. > What are three types of storage you can use with EC2s, and when would you use each?

1. > What does it mean to assign an IPv4 address to your VPC?

1. > What are some use cases for AWS lambda?
1. > What is the difference between the Role and Resource-based policies for Lambda?
1. > What is the difference between the push-model vs. subscribe model for Lambda?
