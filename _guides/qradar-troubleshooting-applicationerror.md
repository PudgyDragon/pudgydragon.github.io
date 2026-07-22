---
title: "Applicationerror"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/ApplicationError.md"
---

# Application Error When Searching
This issue occurred after using custom DSMs from a third party application. The default event property "Count" was duplicated by a custom event property of the same name, causing us not to be able to group our searches.

## Finding the Property ID
If you know which property is causing the issue, you can find the property ID with the following command:
```
psql -U qradar -c "select id, propertyname from ariel_regex_property where propertyname like '%count%';"
```
In this instance, we're finding the ID and name of anything that has the word "count" in it.
## Solving the Issue
Once you have the ID, you can run the following command to change the name of your custom event property so it's not the same as the default property:
```
psql -U qradar -c "update ariel_regex_property set propertyname = 'System Event Count' where id = '<your_id>';"
```
After running this command, restart tomcat using the command:
```
systemctl restart tomcat
```
## Wrapping Up
Once tomcat has been restarted, you may need to clear your browser cache. If you're reading this, hopefully this helped you fix any similar issues you may have had.
