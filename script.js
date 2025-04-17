document.addEventListener("DOMContentLoaded", () => {
    fetch("channels.json")
        .then(response => response.json())
        .then(data => {
            const categoryTabs = document.getElementById("categoryTabs");
            const channelList = document.getElementById("channelList");
            const videoPlayer = document.getElementById("videoPlayer");
            let firstChannelPlayed = false; // Flag to track auto-play

            // Function to display channels
            const displayChannels = (channels) => {
                channelList.innerHTML = ""; // Clear list
                channels.forEach((channel, index) => {
                    const channelButton = document.createElement("button");
                    channelButton.style.display = "flex";
                    channelButton.style.flexDirection = "column";
                    channelButton.style.alignItems = "center";
                    channelButton.style.textAlign = "center";

                    // Create logo element
                    const logoImage = document.createElement("img");
                    logoImage.src = channel.logo;
                    logoImage.alt = channel.name + " logo";
                    logoImage.style.width = "50px";
                    logoImage.style.height = "auto";

                    // Create text element
                    const channelName = document.createElement("span");
                    channelName.textContent = channel.name;

                    // Add logo and name to button
                    channelButton.appendChild(logoImage);
                    channelButton.appendChild(channelName);

                    channelButton.addEventListener("click", () => {
                        videoPlayer.src = channel.url;
                        videoPlayer.play();
                    });

                    channelList.appendChild(channelButton);

                    // Auto-play only the first time when loading
                    if (!firstChannelPlayed && index === 0) {
                        videoPlayer.src = channel.url;
                        videoPlayer.play();
                        firstChannelPlayed = true; // Set flag to prevent re-auto-playing
                    }
                });
            };

            // Get unique categories
            const categories = [...new Set(data.channels.map(channel => channel.category))];

            // Create "All" button
            const allButton = document.createElement("button");
            allButton.textContent = "All";
            allButton.classList.add("active"); // Set as active initially
            allButton.addEventListener("click", () => {
                displayChannels(data.channels);
                setActiveButton(allButton);
            });
            categoryTabs.appendChild(allButton);

            // Create category buttons
            categories.forEach(category => {
                const button = document.createElement("button");
                button.textContent = category;
                button.addEventListener("click", () => {
                    const filteredChannels = data.channels.filter(channel => channel.category === category);
                    displayChannels(filteredChannels);
                    setActiveButton(button);
                });
                categoryTabs.appendChild(button);
            });

            // Function to set active button
            const setActiveButton = (activeButton) => {
                document.querySelectorAll(".category-tabs button").forEach(btn => btn.classList.remove("active"));
                activeButton.classList.add("active");
            };

            // Display all channels initially & auto-play only once
            displayChannels(data.channels);
        })
        .catch(error => console.error("Error loading channels:", error));
});