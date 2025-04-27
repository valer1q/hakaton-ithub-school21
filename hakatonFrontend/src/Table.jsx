import { Table, LoadingOverlay, Text, Alert, Button } from "@mantine/core";
import { useState, useEffect } from "react";

const getLevel = (points) => {
  if (points < 900) return "Low";
  if (points < 1500) return "Medium";
  return "High";
};

function SkillsTable({ levelFilter, skillFilter, initialSkillFilter }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (signal) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/all', {
        signal,
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('API returned non-JSON response');
      }

      const usersData = await response.json();
      
      const formattedData = usersData.flatMap(user => 
        user.skills?.map(skill => ({
          "User name": user.username,
          "Skill name": skill.name,
          "Skill points": skill.points
        })) || []
      );

      return formattedData;
    } catch (err) {
      if (err.name !== 'AbortError') {
        throw new Error(`Failed to load data: ${err.message}`);
      }
      return null;
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadData = async () => {
      try {
        const result = await fetchData(controller.signal);
        if (isMounted && result) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    
    fetchData(controller.signal)
      .then(result => {
        if (result) setData(result);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const filteredData = data.filter(element => {
    const matchesSkill = !skillFilter && !initialSkillFilter 
      ? true 
      : (skillFilter || initialSkillFilter).toLowerCase() === element["Skill name"].toLowerCase();
    
    const matchesLevel = !levelFilter || 
      getLevel(element["Skill points"]) === levelFilter;
    
    return matchesSkill && matchesLevel;
  });

  if (error) {
    return (
      <Alert variant="light" color="red" title="Ошибка загрузки" my="md">
        <Text mb="sm">{error}</Text>
        <Button onClick={handleRetry} size="sm">
          Повторить попытку
        </Button>
      </Alert>
    );
  }

  if (loading) {
    return <LoadingOverlay visible overlayProps={{ blur: 2 }} />;
  }

  if (filteredData.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="md">
        {data.length === 0 ? 'Нет данных' : 'Нет навыков, соответствующих фильтрам'}
      </Text>
    );
  }

  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Пользователь</Table.Th>
          <Table.Th>Навык</Table.Th>
          <Table.Th>Баллы</Table.Th>
          <Table.Th>Уровень</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {filteredData.map((element, index) => (
          <Table.Tr key={`${element["User name"]}-${element["Skill name"]}-${index}`}>
            <Table.Td>{element["User name"]}</Table.Td>
            <Table.Td>{element["Skill name"]}</Table.Td>
            <Table.Td>{element["Skill points"]}</Table.Td>
            <Table.Td>
              <Text 
                fw={600}
                c={{
                  "High": "green.6",
                  "Medium": "yellow.6",
                  "Low": "gray.6"
                }[getLevel(element["Skill points"])]}
              >
                {getLevel(element["Skill points"])}
              </Text>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export default SkillsTable;