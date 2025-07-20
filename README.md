# Pantheon

A modern Pokémon team builder designed to integrate seamlessly with the NeoPaste ecosystem. Pantheon allows you to build your Pokémon team with real-time data from PokéAPI, customize their stats, abilities, and moves, and then export your team in various formats.

## Features

- **Modern UI**: A clean, glassmorphic interface that's intuitive and visually appealing.
- **Real-time Pokémon Data**: Fetches species, stats, abilities, and moves from the PokéAPI.
- **Customization**: Fine-tune your Pokémon with IV/EV sliders, nature selection, and move autocompletion.
- **Drag-and-Drop Reordering**: Easily reorder your team by holding and dragging Pokémon cards.
- **Local Storage**: Your team is automatically saved to your browser's local storage.
- **Accent Color Picker**: Customize the look of the interface with a selection of accent colors.
- **Multiple Export Options**:
    - **Export to NeoPaste**: Saves your team to a Supabase backend and provides a shareable NeoPaste link.
    - **Export to Clipboard**: Copies the NeoPaste link to your clipboard.
    - **Export to PNG**: Renders a specific Pokémon card as a downloadable PNG image.

## Setup

Pantheon is a static web application and requires no build tools or complex setup.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/pantheon.git
    ```
2.  **Navigate to the project directory**:
    ```bash
    cd pantheon
    ```
3.  **Open `index.html` in your browser**:
    You can simply open the `index.html` file in your preferred web browser to start using Pantheon.

## How to Use

1.  **Open the Application**: Launch `index.html` in your browser.
2.  **Build Your Team**:
    - Click on any of the six empty card slots to open the Pokémon editor.
    - Search for a Pokémon by name.
    - Customize its stats, nature, ability, and moves.
    - Click "Save" to add the Pokémon to your team.
3.  **Reorder Your Team**:
    - Click and hold a Pokémon card for one second to enter drag-and-drop mode.
    - Drag the card to a new position in the grid.
4.  **Export Your Team**:
    - **To NeoPaste**: Click the "Export to NeoPaste" button. This will generate a unique link for your team.
    - **To Clipboard**: Click the "Export to Clipboard" button to copy the NeoPaste link.
    - **To PNG**: Click the "Export to PNG" button, then select a Pokémon card to download it as an image.

## Linking to NeoPaste

To enable the "Export to NeoPaste" functionality, you need to configure your Supabase credentials.

1.  **Create a Supabase Project**: If you don't have one already, create a new project on [Supabase](https://supabase.io/).
2.  **Create a Table**: In your Supabase project, create a table named `teams` with the following columns:
    - `id` (uuid, primary key)
    - `created_at` (timestamp with time zone)
    - `team_data` (jsonb)
3.  **Get Your Credentials**: Find your Supabase URL and anon key in your project's API settings.
4.  **Update `script.js`**: Open the `script.js` file and replace the placeholder values for `supabaseUrl` and `supabaseKey` with your credentials.

    ```javascript
    const supabaseUrl = 'YOUR_SUPABASE_URL';
    const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    ```

## Deployment

Since Pantheon is a static site, you can easily deploy it to services like GitHub Pages, Netlify, or Vercel.

### Deploying to GitHub Pages

1.  **Push to GitHub**: Make sure your project is pushed to a GitHub repository.
2.  **Enable GitHub Pages**:
    - Go to your repository's "Settings" tab.
    - In the "Pages" section, select the branch you want to deploy from (e.g., `main`).
    - Choose the `/root` directory.
    - Click "Save". Your site will be deployed at `https://your-username.github.io/pantheon/`.

## Credits

-   **PokéAPI**: For providing comprehensive Pokémon data.
-   **Pokémon Showdown**: For the Pokémon sprites.
-   **Supabase**: For the backend database and API services.
-   **html2canvas**: For the PNG export functionality.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. 