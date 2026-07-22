---
title: "Can'T Select And Delete Watson Investigation"
project: "QRadar"
category: "Troubleshooting"
description: "A practical troubleshooting for QRadar."
source_url: "https://github.com/PudgyDragon/QRadar/blob/main/Troubleshooting/Can't%20Select%20and%20Delete%20Watson%20Investigation"
---

Sometimes, Watson investigations will error out and you are unable to select and delete them in the APP.
This is a guide for how to delete them with the API.

Navigate to the Admin page, to the section labeled "QRadar with Watson". Click on the icon labeled "API Docs".

From here, navigate to the area labeled "investigations --Offense investigations and Watson searches" and expand
the list. The one we want to use is the DELETE API, which should be colored RED.

After expanding the DELETE API, you will see parameters that need to be filled in. First, you will need to click
the "Try it out" button at the top in order to input data; this button will also populate an "Execute" button.
Next, you will need to provide the offense ID. Finally, you will click "Execute". As long as a 200 code is
received afterwards, the investigation was successful and you won't see it in the Watson GUI.

This method is great for single investigations that can't be deleted.
