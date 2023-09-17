<p align="center">

<p align="center">
  <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/919f20a5-70ee-4a5d-876c-190b66839e85" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/173ae77d-d7b6-4af3-afe7-4af5e6473256" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/e3a72a3f-ed39-4a42-a412-644517ca6a9e" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/9ad5c286-55f7-4418-b374-8a797c41c462" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/78167a87-9b99-4a42-a1b0-6937bbb6c98f" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/c73176ec-e719-4c8b-839f-7649189296c7" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/b3c25f46-7aa6-49e5-9f4e-4aefd6dd1d94" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/e229cfc3-fe24-41f8-a40c-27557a57cf08" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/634d4d35-aecf-4ff4-af7e-5da4dcf84fa9" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/4b0915bc-5edc-4ad0-aad9-5e31fded834c" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/498a8e42-73ca-4dc6-b9f7-74160df59d4f" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/cae734ff-9926-4fd9-a302-bc59d93e4c27" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/d39828e4-a7af-4f95-847c-a34b8b1d9ea0" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/3e86eb9c-b947-4633-ae88-bdf922be1451" height="48px" />
</p>

<p align="center">
  <img width="894" align="center" alt="Screenshot 2023-09-17 at 10 40 30 AM" src="https://github.com/sampoder/hack-the-geese/assets/39828164/916408e1-8e21-4487-9c4c-2dd77e81515b">
</p>

<p align="center">
  <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/919f20a5-70ee-4a5d-876c-190b66839e85" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/173ae77d-d7b6-4af3-afe7-4af5e6473256" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/e3a72a3f-ed39-4a42-a412-644517ca6a9e" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/9ad5c286-55f7-4418-b374-8a797c41c462" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/78167a87-9b99-4a42-a1b0-6937bbb6c98f" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/c73176ec-e719-4c8b-839f-7649189296c7" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/b3c25f46-7aa6-49e5-9f4e-4aefd6dd1d94" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/e229cfc3-fe24-41f8-a40c-27557a57cf08" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/634d4d35-aecf-4ff4-af7e-5da4dcf84fa9" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/4b0915bc-5edc-4ad0-aad9-5e31fded834c" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/498a8e42-73ca-4dc6-b9f7-74160df59d4f" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/cae734ff-9926-4fd9-a302-bc59d93e4c27" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/d39828e4-a7af-4f95-847c-a34b8b1d9ea0" height="48px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/3e86eb9c-b947-4633-ae88-bdf922be1451" height="48px" />
</p>

</p>

**Welcome to the geese cult my friend!** We're Deet, Fayd, and Sam... let us tell you about our geese!

At Hack the North, we found it tough to break the ice and balance coding with socializing. This personal challenge inspired us to create a project that makes it easier to make new friendships and get us all out of our social comfort zones.

That's awesome and all but how does it work? Here's how the game works:

1. Scan your badge's QR code to log in.
2. Find a (new) friend who you'd like to compete against.
3. Receive a prompt, eg. "take a selfie with a person taller than you".
4. Race to take a fun picture based on the prompt before the other player does.
5. Win or lose, then you got to choose wether or not to rematch!

If you've got a HTN badge, head over to [htgeese.tech](https://htgeese.tech/) to take it for a spin!

## How We Built It

We built the websockets server using Go, it manages the game's state and updates the database when necessary. Our front end, include the custom duck generator, is built using Next.js and React. We used GPT-3.5 provided hackathon-relevant prompts, we used Prisma and PostgreSQL for the database, and we stored our images in Vercel Blob.

Here are some janky photos of it in action from when we were testing:

<img src="https://cloud-8bnhwq0dh-hack-club-bot.vercel.app/0screenshot_2023-09-17_at_7.48.45_am.png" width="600px" />
<img src="https://cloud-8bnhwq0dh-hack-club-bot.vercel.app/1screenshot_2023-09-17_at_7.49.03_am.png" width="600px" />
<img src="https://github.com/sampoder/hack-the-geese/assets/39828164/7736f61d-64d0-47fe-88c6-67e0a9f516c1" width="600px" />

_(those are the faces you make at 4am when your code just isn't working...)_

## "Challenges" We Ran Into

First night: total system crash due to the websockets server not properly closing connections, fixed after many tireless hours.. thanks Sam. Fayd had to reimplement the broken QR scanner, twice! We weren't having much luck with those React components. Dieter struggled with coding unique duck colors... but after many bug fixes everything started working together.

Most of all, however, getting to the event was tough for all of us. Sam flew overnight from California (which somehow also involved getting stuck on top of Twin Peaks, walking along an interstate to get from Millbrae BART station to SFO at 2am, and a late night adventure in the Castro), Dieter drove 9 hours from Vermont (only to be told by a customs agent that "Canada was closed"... it was not), and Fayd had a gruelling 30-hour journey from India with layovers (...his bag almost got stuck in Atlanta). But it was worth it!

## Random Photos

This game was all about taking photos! Here are some random photos from our time at HTN:

<img src="https://github.com/sampoder/hack-the-geese/assets/39828164/08ca52f3-2170-453e-b223-0abe5576a1d4" height="250px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/4a7e75e7-e510-48f7-bf8e-38f493a24f4c" height="250px" /> <img src="https://cloud-jz030l9b7-hack-club-bot.vercel.app/0img_1005.jpg" height="250px" /> <img src="https://cloud-a0d0g8i6t-hack-club-bot.vercel.app/1img_3198.jpg" height="250px" /> <img src="https://cloud-bjgg4lc3e-hack-club-bot.vercel.app/0screenshot_2023-09-17_at_11.05.58_am.png" height="250px" /> <img src="https://cloud-6wspcpa2s-hack-club-bot.vercel.app/0prompt-0.9953789439296532.png" height="250px" />

## To Wrap Up...

We learned that making friends is just as crucial as writing good code. The journey from encountering problems to finding solutions showed us that anyone can overcome their fears. And yes, we also discovered that Canada has some really tasty snacks!

<img width="711" alt="Screenshot 2023-09-17 at 11 10 12 AM" src="https://github.com/sampoder/hack-the-geese/assets/39828164/69618422-904b-4aa0-ace3-a29920f4be44">

## Oh and one more thing.

Turns out we were one of the winners! Yay!

<img src="https://github.com/sampoder/hack-the-geese/assets/39828164/04ad88ce-f5a5-4972-ba1e-9d2288a651e9" height="300px" /> <img src="https://github.com/sampoder/hack-the-geese/assets/39828164/2aaf42d3-3d4c-4a93-bea4-4c6b212b3905" height="300px" />

_(that's us moments after we found out and then when we were presenting on stage)_
