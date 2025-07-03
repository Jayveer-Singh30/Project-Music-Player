class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressBar = document.getElementById('progressBar');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.volumeBar = document.getElementById('volumeBar');
        this.volumeProgress = document.getElementById('volumeProgress');
        this.volumeIcon = document.getElementById('volumeIcon');
        this.songTitle = document.getElementById('songTitle');
        this.songArtist = document.getElementById('songArtist');
        this.albumArt = document.getElementById('albumArt');
        this.playlistItems = document.getElementById('playlistItems');
        this.autoplayToggle = document.getElementById('autoplayToggle');

        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.autoplay = false;
        this.volume = 70;

        // Sample playlist with free demo tracks
        this.playlist = [
            {
                title: "Chill Vibes",
                artist: "Demo Artist",
                duration: "3:45",
                src: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltrywnElBSl+zPLZiTcIF2m98OWoUQ==",
                albumArt: "🎧"
            },
            {
                title: "Electronic Dreams",
                artist: "Synth Master",
                duration: "4:12",
                src: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltrywnElBSl+zPLZiTcIF2m98OWoUQ==",
                albumArt: "🎹"
            },
            {
                title: "Acoustic Melody",
                artist: "Guitar Hero",
                duration: "2:58",
                src: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltrywnElBSl+zPLZiTcIF2m98OWoUQ==",
                albumArt: "🎸"
            },
            {
                title: "Jazz Fusion",
                artist: "Smooth Collective",
                duration: "5:23",
                src: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltrywnElBSl+zPLZiTcIF2m98OWoUQ==",
                albumArt: "🎺"
            },
            {
                title: "Rock Anthem",
                artist: "Power Band",
                duration: "3:31",
                src: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltrywnElBSl+zPLZiTcIF2m98OWoUQ==",
                albumArt: "🤘"
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderPlaylist();
        this.loadSong(0);
        this.setVolume(this.volume);
    }

    setupEventListeners() {
        // Play/Pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());

        // Previous/Next buttons
        this.prevBtn.addEventListener('click', () => this.previousSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());

        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.setProgress(e));

        // Volume bar
        this.volumeBar.addEventListener('click', (e) => this.setVolumeFromBar(e));

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.handleSongEnd());

        // Autoplay toggle
        this.autoplayToggle.addEventListener('click', () => this.toggleAutoplay());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    renderPlaylist() {
        this.playlistItems.innerHTML = '';
        this.playlist.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = `playlist-item ${index === this.currentSongIndex ? 'active' : ''}`;
            item.innerHTML = `
                <div class="equalizer" style="display: ${index === this.currentSongIndex && this.isPlaying ? 'flex' : 'none'}">
                    <div class="equalizer-bar" style="--height: 12px;"></div>
                    <div class="equalizer-bar" style="--height: 8px;"></div>
                    <div class="equalizer-bar" style="--height: 15px;"></div>
                    <div class="equalizer-bar" style="--height: 10px;"></div>
                </div>
                <div class="song-info-mini">
                    <div class="song-title-mini">${song.title}</div>
                    <div class="song-artist-mini">${song.artist}</div>
                </div>
                <div class="duration">${song.duration}</div>
            `;
            item.addEventListener('click', () => this.selectSong(index));
            this.playlistItems.appendChild(item);
        });
    }

    loadSong(index) {
        const song = this.playlist[index];
        this.currentSongIndex = index;

        // Update UI
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        this.albumArt.textContent = song.albumArt;

        // Load audio (using placeholder data URLs for demo)
        this.audio.src = song.src;

        // Update playlist visual
        this.renderPlaylist();
    }

    selectSong(index) {
        this.loadSong(index);
        if (this.isPlaying) {
            this.play();
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.playPauseBtn.textContent = '⏸';
            this.albumArt.classList.add('playing');
            this.renderPlaylist();
        }).catch(error => {
            console.log('Playback failed:', error);
            // For demo purposes, simulate playback
            this.simulatePlayback();
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playPauseBtn.textContent = '▶';
        this.albumArt.classList.remove('playing');
        this.renderPlaylist();
    }

    previousSong() {
        const prevIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.playlist.length - 1;
        this.loadSong(prevIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    nextSong() {
        const nextIndex = this.currentSongIndex < this.playlist.length - 1 ? this.currentSongIndex + 1 : 0;
        this.loadSong(nextIndex);
        if (this.isPlaying) {
            this.play();
        }
    }

    setProgress(e) {
        const width = this.progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration || 180; // fallback duration for demo

        this.audio.currentTime = (clickX / width) * duration;
    }

    updateProgress() {
        const { duration, currentTime } = this.audio;
        const progressPercent = (currentTime / duration) * 100;

        this.progress.style.width = `${progressPercent}%`;
        this.currentTimeEl.textContent = this.formatTime(currentTime);
    }

    updateDuration() {
        const duration = this.audio.duration || 180; // fallback for demo
        this.durationEl.textContent = this.formatTime(duration);
    }

    setVolumeFromBar(e) {
        const width = this.volumeBar.clientWidth;
        const clickX = e.offsetX;
        const volume = (clickX / width) * 100;

        this.setVolume(volume);
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume));
        this.audio.volume = this.volume / 100;
        this.volumeProgress.style.width = `${this.volume}%`;

        // Update volume icon
        if (this.volume === 0) {
            this.volumeIcon.textContent = '🔇';
        } else if (this.volume < 30) {
            this.volumeIcon.textContent = '🔈';
        } else if (this.volume < 70) {
            this.volumeIcon.textContent = '🔉';
        } else {
            this.volumeIcon.textContent = '🔊';
        }
    }

    handleSongEnd() {
        if (this.autoplay) {
            this.nextSong();
        } else {
            this.pause();
        }
    }

    toggleAutoplay() {
        this.autoplay = !this.autoplay;
        this.autoplayToggle.textContent = `Autoplay: ${this.autoplay ? 'ON' : 'OFF'}`;
        this.autoplayToggle.classList.toggle('active', this.autoplay);
    }

    handleKeyPress(e) {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'ArrowLeft':
                this.previousSong();
                break;
            case 'ArrowRight':
                this.nextSong();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.setVolume(this.volume + 10);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.setVolume(this.volume - 10);
                break;
        }
    }

    formatTime(time) {
        if (isNaN(time)) return '0:00';

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Demo simulation for audio playback
    simulatePlayback() {
        this.isPlaying = true;
        this.playPauseBtn.textContent = '⏸';
        this.albumArt.classList.add('playing');
        this.renderPlaylist();

        // Simulate progress
        let currentTime = 0;
        const duration = 180; // 3 minutes demo

        const interval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(interval);
                return;
            }

            currentTime += 1;
            const progressPercent = (currentTime / duration) * 100;

            this.progress.style.width = `${progressPercent}%`;
            this.currentTimeEl.textContent = this.formatTime(currentTime);
            this.durationEl.textContent = this.formatTime(duration);

            if (currentTime >= duration) {
                clearInterval(interval);
                this.handleSongEnd();
            }
        }, 1000);
    }
}

// Initialize the music player when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});