---
title: "Importexport  Contents As A Package"
project: "QRadar"
category: "Engineering Guide"
description: "A practical engineering guide for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Guides/ImportExport%20_Contents_as_a_Package"
---

Modified guide for exporting custom content, including DSM and Reports. 

Simplified versions of these methods can be found at:
Export: https://www.ibm.com/docs/en/qsip/7.5?topic=editor-exporting-contents-as-package
Import: https://www.ibm.com/docs/en/qsip/7.5?topic=content-importing-by-using-management-script

Login to the console through SSH and run the following command to start the Content Management Tool:
/opt/qradar/bin/contentManagement.pl

You will get a list of Content Types you can choose from, similar to these:

Custom Content Type----------------String------------------ID
Dashboard--------------------------dashboard---------------x
Reports----------------------------report------------------x
Saved Searches---------------------search------------------x
FGroup-----------------------------fgroup------------------x
FGroup Type------------------------fgrouptype--------------x
Custom Rules-----------------------customrule--------------x
Custom Properties------------------customproperty----------x
Log Source-------------------------sensordevice------------x
Log Source Type--------------------sensordevicetype--------x
Log Source Category----------------sensordevicecategory----x
Log Source Extensions--------------deviceextension---------x
Custom QidMap Entries--------------qidmap------------------x
ReferenceData Collection-----------referencedata-----------x
Offense Mapper Type----------------offensetype-------------x
Historical Correlation Profile-----historicalsearch--------x
Custom Functions-------------------custom_function---------x
Custom Actions---------------------custom_action-----------x
Applications-----------------------installed_application---x

From here, determine what content type you want to export. If you are looking for a specific report within the Reports
Content Type, you can search for it using a similar command, where 10 is the ID:

/opt/qradar/bin/contentManagement.pl -a search -c 10 -r "(.*?)"

The above command lists every report within the Reports Content Type. In order to export a specific report, you will need
to provide the repots ID (which can be found in your search results) in the next step.

Create a .txt file on the console using:
vi <filename>.txt
(Example: vi reportexport.txt)

Press the insert key to be able to edit the file and, depending on the type of content you want, use the following format
with your desired content string:
sensordevicetype, 24,26,95

In this example, we want any content from sensordevicetype with the IDs of 24, 26, and 95. If you want to have every
sensordevicetype and not just specific ones, you can use the format:
sensordevicetype, all

Press esc, :wq, enter to save the file.

You will then run the following command to export the contents into the file you just created:
/opt/qradar/bin/contentManagement.pl -a export -c package -f <file>
(Example: /opt/qradar/bin/contentManagement.pl -a export -c package -f reportexport.txt)

This will export the desired contents and place them in a zip folder in the same location as your original text file.
From here, you can use WinSCP to transfer the file from the console to whatever location on your local host. Please
remember to remove any files that were created from the console when you are done using:

rm <file>
(Example: rm reportexport.txt)

When you want to import them, place them on the desired asset through whatever means you use (WinSCP in this instance).
cd to the location where your export file is at, and run the following command:
/opt/qradar/bin/contentManagement.pl --action import -f fgroup-ContentExport-20120418163707.tar.gz
replacing the .tar.gz file with the name of your own
