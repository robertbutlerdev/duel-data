# duel-data

## Developer setup
1. Install `asdf` - https://asdf-vm.com/guide/getting-started.html
    1. Install tools with `asdf install`
    1. Might need to run `asdf plugin add pnpm https://github.com/jonathanmorley/asdf-pnpm.git` and `asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`
1. Install packages `pnpm install`
1. Run locally `pnpm serve` (needs docker)
1. Swagger is at http://localhost:5001/api-docs
1. Database connection details are in `.ENV.DB`
1. `apps/processJob/src/run.ts` is the start of processing and validating the data

## Estimated time spent
* Started at 6:30pm on 12/06/2025 stopped at 8pm, npm was down
* Started at 6:30am on 13/06/2025 finished at 1pm
* Started at 9am on 17/06/2025 finished at 9pm

## Considerations
* Decided to use asdf for ease of installing tools
* Could send the data from processJob through the API, but it can just go direct to the DB to avoid putting uncesessary load on the API
* Have removed the ._user files in the data import. Seems to be metadata from zipping up on mac.
* If this was a long running process and we expected these files on a regular basis then running this from a queue such as sqs/sns would be nice.
* At the moment process job is processing all the data when code changes happen. This results in duplicates since the userId can't be trusted to be populated. Ideally we should have a script to run which triggers the files to be pushed into a process folder with process job removing them when complete. Or we use a queue for process Job to be listening to and the script pushes them into there. Not a major concern since this is a prototype.
* It would be nice to add unit and or integration tests. Integration tests would allow us to prove the dev environment runs as expected.

## Data analysis
* There are no valid duplicate advocacyProgramIds
* There are no valid duplicate userIds
* There are 4 duplicate emails - We could potentially link this data back to the same user although unsure why the system would have emails with different userIds. Indicates that the email is not a unique value when creating a user.
* There are duplicate names, but this could be a coincidence since people can have the same name so we can't join the data across.
* There are multiple brands reused which makes sense, a brand would probably have multiple embassadors. It would be nice to have the brands linked back to a single place to allow easy analytics on the metrics for each brand.
* Each advacosy program appears to be a one to one relationship from brand to the user. Or from the user to the program, so that a brand can have multiple brands liked to the same embassador.
* I'm not sure how Reach is calculated

We have multiple metrics we can use from this data set which may be useful to the client and to allow us to measure success.
1. Likes, Shares, Comments and Reach for each platform
1. Likes, Shares, Comments and Reach for each embassador (are embassadors linked to mutiple brands?)
1. Do embassadors use multiple platforms for the same brand? Can we compare to see if we think this helps or hinders reach?
1. Total sales attributed from each user grouped by brand
1. Total sales attributed from each user across all brands (awards for the best embassadors?)
1. Total sales attributed for each brand across all users

It would be nice to see if we can add more data for future datasets.
1. Task completed on date
1. Task last activity on date (like, share, comment, reach)

## Missing/invalid data
Columns are not always complete and a decision should be made on what we do with data when columns are missing. I have assumed nullable for every field but this doesn't feel accurate for a live system.
1. UserId should never be null
1. Name may not have been captured on signup, but we can prompt for the name when they next login to the system?
1. I assume Email is how we usually communicate with the user, or how they login to the system. If this is null then it means they don't login to the system and we do not communicate to them via email. Maybe we send messages on instagram/tiktok. In that case what should be done with a user with no valid email, instagram or tiktok. Has ths been omitted for a reason?

We can validate to make sure if the data is not in a valid format we either fill in something valid (joined_at), or we don't use the data. If the data isn't valid then it might skewer the numbers we report on to clients or cause other issues down the line