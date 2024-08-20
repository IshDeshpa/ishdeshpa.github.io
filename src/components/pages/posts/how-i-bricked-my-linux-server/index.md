---
title: How I Bricked my Linux Server
date: 2024-01-12
---

I haven't posted to this blog in a while since life has gotten extremely busy and I am left with little to no time for personal projects. However, this winter break I decided to take my little brother's old laptop and turn it into a Linux Server. Unfortunately, it quickly turned into a tragedy.

I plan to use this Linux Server as a Network Attached Storage device. I put a SSD in the CD-ROM slot which expanded its storage capacity from 1 TB, adding on another 256 GB. I then loaded Ubuntu Server 22.04 onto the laptop with a USB drive. I've gained experience with the Linux terminal through LHR Solar, so I thought it wouldn't be a problem to work on the machine this way.

I was able to set up basic SSH into the machine, and even ran a Minecraft server on it for a while within a Docker container. Then, I decided to pursue [Linux From Scratch](https://www.linuxfromscratch.org/lfs/), a project designed to teach you more about the internals of Linux and to allow you to load packages on your own + read about them, letting you customize **exactly** what's on your machine. It's very powerful knowing every single piece of code running on your machine, and I've been learning a lot from it (although it's mostly just running a configuration script, a Makefile, and then waiting around a lot).

I started the project on my SSD and began cross-compiling packages as the book suggested. I created a user called lfs and ran most of my commands on that user, although some were ran as root. When running most of these commands, an environment variable called $LFS is set to the base directory of LFS (in this case, my mounted partition on my SSD). Remember, since I have Ubuntu Server as well as LFS on this machine, I have two versions of most of the necessary directories for packages and the kernel (for example, $LFS/usr, the LFS version of the user directory, versus just /usr, the main OS version of it).

Unfortunately, I forgot that the environment variable was not set automatically when logging in as root (as opposed to my own user, ishdeshpa, or the lfs user, since it was in the profile script that runs automatically on login).

I ran the following command as root (see [Chapter 7.2 of the LFS book](https://www.linuxfromscratch.org/lfs/view/stable-systemd/chapter07/changingowner.html)).

```
chown -R root:root $LFS/{usr,lib,var,etc,bin,sbin,tools}
```

However, since $LFS was not set, it was an empty string, which means I just recursively overwrote the ownership of every single file in most of the main directories of my server, not in my actual LFS partition. It was too late when I realized this, and I had already logged out of root.

When I tried logging back in as root using both **sudo** and **su**, I was not able to, since both of these commands were now under only **root** ownership and could only be run by a user with root permissions. However, I could not log in as a user with root permissions, since I needed these commands to do so!

In theory I could log into root from BIOS and then change the permissions of every single file back to what it should be, but it's much easier to backup my data as ishdeshpa and then reload my OS. Luckily I'm still able to do stuff as ishdeshpa so it's not _totally_ bricked, but I can't do any more actual LFS stuff since it requires root perms. I'm curious to see if I will have to do LFS all over again, or if the permissions will remain on the files within LFS. I _think_ permissions are an OS thing, so they may be gone when I remount my SSD in my fresh install of Ubuntu Server, but I guess we'll have to see.

This sort of stuff is a learning experience and I encourage everyone to brick their Linux machine as well. I may try using snapshots with [rsnapshot](https://ubuntu.com/server/docs/tools-rsnapshot) to prevent this in the future. At least I get more experience with reinstalling Ubuntu Server😞.
