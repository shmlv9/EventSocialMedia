import {apiFetch} from "@/lib/api/apiFetch";

export async function fetchEvent(id: string) {
    return {
        id: "1",
        title: "Встреча фронтенд-разработчиков",
        date: "15 июня 2024",
        startDate: "",
        endDate: "",
        location: "Коворкинг 'Зелёный', Москва",
        description: "Ежемесячная встреча фронтенд-разработчиков. Обсудим новые тенденции в React и Next.js, поделимся опытом и просто приятно пообщаемся. Приглашённый спикер - ведущий разработчик из VK.",
        organizer: {
            name: "Алексей Петров",
            avatar: "https://foodcity.ru/product/tykva",
        },
        participantsCount: 24,
        image: "https://foodcity.ru/product/tykva"
    }
    // const response = await apiFetch(`${id}`, {
    //     method: 'GET',
    // })
    // return response.ok;
}