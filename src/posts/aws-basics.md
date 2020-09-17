---
path: "/aws-basics"
date: "2020-09-16"
title: "AWS Basics"
excerpt: "AWS absolute basics, for beginners"
published: false
slug: "aws-basics"
---

First thing's first. Create an AWS account, if you don't already have one.

## Creating a Billing Alarm

Now, let's create billing alarm, to make sure we don't rack up a huge bill by accident. To do this, we're going to use the AWS service "CloudWatch". Log into the AWS console, then select the "CloudWatch" from the services list.

Under "Alarms" select "Billing". Click "Create Alarm". Under "Metrics" select "Total Estimated Changes".

Check the metric box and click "Select Metric".

Under Conditions, select "Static" and then "Greater/Equal". For the threshold value, put \$1, or whatever amount you want to trigger a notification.

Select "In alarm" for the trigger state.

Create an SNS topic with any name you'd like. "My_CloudWatch_Billing_Alarms_Topic". Click Next.

Add a Name and Description for the Alarm, and click "Create Alarm".
