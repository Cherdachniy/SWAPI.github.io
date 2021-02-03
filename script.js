fetch('https://swapi.dev/api/planets/').then((response) => {
    return response.json();
}).then((result) => {

        let orbits = document.querySelector('.orbits');

        for (let i = 0; i < result.results.length; i++) {

            const planetData = result.results[i];

            //Create orbit
            let orbit = document.createElement('div');
            orbit.classList.add('orbit', planetData.name.toLowerCase().replace(/ +/, '-'));

            //Distance between orbit and animation
            let bounds = orbits.getBoundingClientRect();
            orbit.style.height = `${bounds.height / result.results.length * (i + 1) - 20}px`;
            orbit.style.width = `${bounds.width / result.results.length * (i + 1) - 20}px`;
            orbit.style.animationDuration = `${planetData.orbital_period / 10}s`;

            //Create planet
            let planet = document.createElement('div');
            planet.classList.add('planet', planetData.name.toLowerCase().replace(/ +/, '-'));
            planet.style.height = `${planetData.diameter / 1000}px`;
            planet.style.width = `${planetData.diameter / 1000}px`;

            //Add image to planet
            let planetImg = document.createElement('img');
            planetImg.src = `images/${planetData.name}.png`;
            planetImg.style.width = '100%';
            planet.appendChild(planetImg);

            const popup = document.querySelector('.planet-popup');

            planet.addEventListener('mouseenter', () => {
                popup.querySelector('.title').innerHTML = planetData.name;
                popup.querySelector('.terrain span').innerHTML = planetData.terrain;
                popup.querySelector('.population span').innerHTML = planetData.population;
                popup.classList.add('active');
                document.querySelectorAll('.orbit').forEach(el => {
                    el.style.animationPlayState = 'paused';
                });

                //Create popup
                const onMove = (e) => {
                    popup.style.left = `${e.clientX + 20 + window.scrollX}px`;
                    popup.style.top = `${e.clientY + window.scrollY}px`;
                }

                planet.addEventListener('mousemove', onMove);

                planet.addEventListener('mouseleave', () => {
                    popup.classList.remove('active');
                    planet.removeEventListener('mousemove', onMove);
                    document.querySelectorAll('.orbit').forEach((el) => {
                        el.style.animationPlayState = 'running';
                    });
                }, {once: true});
            });

            orbit.appendChild(planet);
            orbits.appendChild(orbit);

            //List of planet
            let planetList = document.querySelector('.list');
            let planetTitle = document.createElement('div');
            planetTitle.classList.add('planetTitle');
            planetTitle.innerText = `${planetData.name}`;

            planetList.appendChild(planetTitle);

            //Fill list of planet
            let about = document.querySelector('.about');

            //Write text like old computers
            function writeText(el, text, delay) {
                return new Promise((resolve) => {
                    let idx = 0;
                    text = text || '';
                    setTimeout(() => {
                        let handle = setInterval(() => {
                            el.innerHTML = text.slice(0, ++idx) + '_';
                            if (idx > text.length) {
                                clearInterval(handle);
                                el.innerHTML = text;
                                resolve();
                            }
                        }, 65);
                    }, delay);
                });
            }

            //Loading info about planet, highlighting this planet and her name in list
            function loadInfo(tag) {
                Array.from(tag).forEach((el) => {
                    el.classList.remove('active');
                    el.style.pointerEvents = 'none';
                    el.style.opacity = '0.5';
                    document.querySelectorAll('img').forEach((el) => {
                        el.classList.remove('active');
                        el.style.pointerEvents = 'none';
                    });
                });

                planetImg.classList.add('active');
                planetTitle.classList.add('active');

                Promise.all([
                    writeText(about.querySelector('.title span'), planetData.name, 100),
                    writeText(about.querySelector('.climate span'), planetData.climate, 200),
                    writeText(about.querySelector('.terrain span'), planetData.terrain, 300),
                    writeText(about.querySelector('.population span'), planetData.population, 400),
                    writeText(about.querySelector('.gravity span'), planetData.gravity, 500),
                    writeText(about.querySelector('.diameter span'), planetData.diameter, 600),
                    writeText(about.querySelector('.orbital-period span'), planetData.orbital_period, 700),
                    writeText(about.querySelector('.rotation-period span'), planetData.rotation_period, 800),
                    writeText(about.querySelector('.surface-water span'), planetData.surface_water, 900)
                ]).then(() => {
                    Array.from(tag).forEach((el) => {
                        el.style.pointerEvents = '';
                        el.style.opacity = '';
                        document.querySelectorAll('img').forEach((el) => {
                            el.style.pointerEvents = '';
                        });
                    });
                });
            }

            //Events
            planetImg.addEventListener('click', (e) => {
                e.preventDefault();
                loadInfo(planetList.children);
            })

            planetTitle.addEventListener('click', (e) => {
                e.preventDefault();
                loadInfo(planetList.children);
            });
        }
    }
);
