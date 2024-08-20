---
title: The Longhorn Racing Solar Team - 2021-22 Retrospective
date: 2022-09-02
---

Over the summer, I attended the Formula Sun Grand Prix with the Longhorn Racing Solar Team at the Heartland Motorsports Park in Topeka, Kansas. For our team, this was the first solar car event that most, if not all, of our members had been to. For the past two years, the team has been designing and building a solar powered car from the ground up, with the end goal of a driver being able to race it around the track.



![](post-assets/Image-from-iOS-1024x768.jpg)



The solar car in question, Solar McQueen





The 2021-2022 school year was my rookie year as a member of the Longhorn Racing Solar Team (specifically, the Controls subteam). I started at [level zero](https://www.youtube.com/watch?v=dWo0dm16wLY), but quickly learned quite a bit about writing embedded C for an ARM-based microcontroller, utilizing resource protection tools like mutexes and semaphores, and using a Real-Time Operating System (for our car, the Micrium RTOS). I also learned to use GitHub Issues and follow a traditional software workflow: creating and using issue tickets, git branches, and pull requests to best document and contribute to a larger [codebase](https://github.com/lhr-solar/Controls).

The most interesting thing about my experience so far is the amount of validation and review that goes into writing a codebase as large as this one. Upon getting assigned an issue ticket, I may write some passable code that will do the job it's supposed to in my head. That submission then gets picked to shreds by the leads and experienced members of the team, pointing out each and every issue with the code. This includes anything as small as poor documentation or improper variable names, to larger problems like poor software design choices or points of failure in the code.

One of the lessons I learned in LHR Solar is that _functional code is not good enough_. When working with a team of developers, every line of code needs to make perfect sense to the next guy: documented properly, consistent with convention, and readable. If it doesn't follow these standards, the cost is time, which is especially valuable when you're working up to the deadline and sometimes even after!



![](post-assets/DSC04329_HDR-1024x683.jpg)



A picture of "all" of the teams present at the Formula Sun Grand Prix 2022





The Longhorn Racing Solar Car is not in the above picture. We did not show up to the team photo that was taken at 8:00 AM because our team members were sleeping at the hotel — but not because they were lazy. Many of our team members had stayed at the garage near the track overnight for more than half of the event. Sleeping in the car, the truck, in folding lawn chairs. That sleep was well deserved after a three or four day sprint of nonstop work on the car.

And yet, when it was all said and done, our car did not race. In fact, we did not pass inspection at all during the seven or eight days that the event took place. The event revealed many design flaws that had been made early in the process, from the car's body design to the custom battery management system the team had spent the past two years building. Many of these issues can be chalked up to inexperience; our team has existed since the dawn of time, and yet almost all of our members were complete novices to the process of designing a solar car.

I don't want this to be seen as an excuse, but rather highlight it as a point of accomplishment. The dedication I've seen from the members on this team is unrivaled. My contribution to the car pales in comparison to many of the more senior and more involved members, and I commend their work ethic.

The team has committed itself to a 1 year design cycle for 2022-23, planning to race again with a new and improved car at the 2023 FSGP. On the Controls side of things, we are restructuring our applications layer, making incremental changes to our codebase, designing a new circuit board, and introducing new members to the same things that I learned over the past year. I hope they get as much out of it as I did.

Onward to a new season and school year!
