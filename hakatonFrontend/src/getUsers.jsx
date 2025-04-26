// import React, { useState, useEffect } from 'react';

// const App = () => {
//   const [elements, setElements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 1. Получаем данные с API
//         const response = await fetch('http://127.0.0.1:8000/api/users/all');
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const usersData = await response.json();

//         // 2. Преобразуем данные в нужный формат
//         const formattedData = usersData.flatMap(user => {
//           return user.skills.map(skill => ({
//             "User name": user.username,
//             "Skill name": skill.name,
//             "Skill points": skill.points
//           }));
//         });

//         // 3. Сохраняем преобразованные данные в state
//         setElements(formattedData);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div>
//       <h1>User Skills</h1>
//       <pre>{JSON.stringify(elements, null, 2)}</pre>
//     </div>
//   );
// };

// export default App;